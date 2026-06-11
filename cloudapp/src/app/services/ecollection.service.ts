import { Injectable } from '@angular/core';
import { CloudAppRestService, HttpMethod } from '@exlibris/exl-cloudapp-angular-lib';
import { withErrorChecking } from '../models/utils';
import { ECollection, Actions, FieldActions } from '../models/ecollection';
import { DatePipe } from '@angular/common';
import { ElectronicServices } from '../models/eservice';

@Injectable()
export class EcollectionService {

  constructor(
    private restService: CloudAppRestService,
    private datePipe: DatePipe
  ) { }

  get(id: string) {
    return withErrorChecking(this.restService.call(`/electronic/e-collections/${id}`));
  }

  getService(link: string) {
    return this.restService.call(link);
  }

  getServices(collectionId: string) {
    return this.restService.call<ElectronicServices>(`/electronic/e-collections/${collectionId}/e-services`);
  }

  update(entity: any) {
    return withErrorChecking(this.restService.call({
      url: entity.link,
      requestBody: entity,
      method: HttpMethod.PUT
    }), {id: entity.id});
  }

  merge(orig: any, src: any, actions: Actions) {
    if (Object.keys(actions).length==0) return orig; // nothing to do
    for (const key of Object.keys(src)) {
      const field = Object.keys(actions).find(name=>key==name.split('.')[0]);
      if (!field || actions[field] == FieldActions.NONE) {
        delete src[key];
      } else if (actions[field] == FieldActions.APPEND) {
        if (orig[key]) src[key] = orig[key] += `; ${src[key]}`;
      } else if (actions[field] == FieldActions.CLEAR) {
        src[key] = key.includes("_date") || key === "public_access_model" ? null : "";
      }
    }
    ['activation_date', 'expected_activation_date', 'service_unavailable_date', 'service_unavailable_until_date', 'active_from_date', 'active_until_date'].forEach(f=>this.formatDate(src, f));
    ['do_not_show_as_full_text_available_in_cdi_even_if_active_in_alma', 'activate_new_portfolios', 'delete_removed_portfolios'].forEach(f=>this.formatBoolean(src, f));
    this.removeDeactivateIfNeeded(orig, src, actions);
    return Object.assign(orig, src);
  }

  private formatDate(obj: ECollection, field: string) {
    if (!obj[field]) return;
    obj[field] = this.datePipe.transform(obj[field],'yyyy-MM-dd');
  }

  private formatBoolean(obj: ECollection, field: string) {
    if (obj[field] == undefined) return;
    obj[field] = obj[field] === 'true';
  }

  private removeDeactivateIfNeeded(orig: any, src: any, actions: Actions) {
    const deactivateActionKey = Object.keys(actions).find(name => name.split('.')[0] === 'deactivate_removed_portfolios');
    const deactivateActionIsNone = !deactivateActionKey || actions[deactivateActionKey] === FieldActions.NONE;
    const deleteFlag = (src.hasOwnProperty('delete_removed_portfolios') ? src.delete_removed_portfolios : orig.delete_removed_portfolios);
    if (deactivateActionIsNone && !!deleteFlag) {
     delete orig['deactivate_removed_portfolios'];
    }
}

}
