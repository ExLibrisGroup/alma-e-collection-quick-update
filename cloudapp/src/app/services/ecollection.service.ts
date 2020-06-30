import { Injectable } from '@angular/core';
import { CloudAppRestService, HttpMethod } from '@exlibris/exl-cloudapp-angular-lib';
import { withErrorChecking } from '../models/utils';
import { ECollection, Actions, FieldActions } from '../models/ecollection';
import { DatePipe } from '@angular/common';

@Injectable()
export class EcollectionService {

  constructor(
    private restService: CloudAppRestService,
    private datePipe: DatePipe
  ) { }

  get(id: string) {
    return withErrorChecking(this.restService.call(`/electronic/e-collections/${id}`));
  }

  update(ecol: any) {
    return withErrorChecking(this.restService.call({
      url: `/electronic/e-collections/${ecol.id}`,
      requestBody: ecol,
      method: HttpMethod.PUT
    }), {id: ecol.id});
  }

  merge(orig: any, src: ECollection, actions: Actions) {
    if (Object.keys(actions).length==0) return; // nothing to do
    for (const key of Object.keys(src)) {
      const field = Object.keys(actions).find(name=>key==name.split('.')[0]);
      if (!field || actions[field] == FieldActions.NONE) {
        delete src[key];
      } else if (actions[field] == FieldActions.APPEND) {
        src[key] = orig[key] += `; ${src[key]}`;
      }
    }
    if (src.activation_date) {
      src.activation_date = src.activation_date == ""
        ? null
        : this.datePipe.transform(src.activation_date,'yyyy-MM-dd');
    }
    if (src.expected_activation_date) {
      src.expected_activation_date = src.expected_activation_date == "" 
        ? null
        : this.datePipe.transform(src.expected_activation_date,'yyyy-MM-dd');
    }
    return Object.assign(orig, src);
  }

}
