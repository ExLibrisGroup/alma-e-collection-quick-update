import { Injectable } from '@angular/core';
import { CloudAppRestService, HttpMethod } from '@exlibris/exl-cloudapp-angular-lib';
import { withErrorChecking } from '../models/utils';

@Injectable()
export class EcollectionService {

  constructor(
    private restService: CloudAppRestService
  ) { }

  getECollection(id: string) {
    return withErrorChecking(this.restService.call(`/electronic/e-collections/${id}`));
  }

  updateECollection(ecol: any) {
    return withErrorChecking(this.restService.call({
      url: `/electronic/e-collections/${ecol.id}`,
      requestBody: ecol,
      method: HttpMethod.PUT
    }), {id: ecol.id});
  }

}
