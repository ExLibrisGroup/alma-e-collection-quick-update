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
        src[key] = "";
      }
    }
    ['activation_date', 'expected_activation_date', 'service_unavailable_date'].forEach(f=>this.formatDate(src, f));
    ['is_suppressed_from_cdi', 'activate_new_portfolios'].forEach(f=>this.formatBoolean(src, f));
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

}
