import { Value } from "./ecollection";

export class EService {
  internal_description: string = "";
  public_description: string = "";
  authentication_note: string = "";
  public_note : string = "";
  activation_status : Value = new Value();
  proxy_enabled: Value = new Value();
  proxy: string = "";
  parser_override : string = "";
  parser_parameters_override : string = ""; 
  dynamic_url_override: string ="";
  url_type_override: Value = new Value();
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