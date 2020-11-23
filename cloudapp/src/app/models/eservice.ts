import { Value } from "./ecollection";

export class EService {
  internal_description: string = "";
  public_description: string = "";
  activate_new_portfolios: boolean = null;
  service_temporarily_unavailable: Value = new Value();
  service_unavailable_reason: string = "";
  service_unavailable_date: string = "";
}

export function isEService(obj: any): obj is EService {
  return "service_temporarily_unavailable" in obj;
}

export interface ElectronicServices {
  electronic_service: EService[]
}