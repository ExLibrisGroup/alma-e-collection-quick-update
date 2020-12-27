export class ECollection {
  internal_description: string = "";
  proxy_enabled: Value = new Value();
  free: Value = new Value();
  proxy: string = "";
  category: string = "";
  access_type: Value = new Value();
  counter_platform: Value = new Value();
  license: Value = new Value();
  library: Value = new Value();
  activation_date: string = "";
  expected_activation_date: string = "";
  is_selective: Value = new Value();
  is_suppressed_from_cdi: boolean = null;
  public_note: string = "";
}

export class Value {
  value: string = ""
}

export type FormActions = {
  [form in 'service' | 'collection']: Actions;
}

export interface Actions {
	[key: string]: FieldActions;
}

export enum FieldActions {
  NONE = 'NONE',
  CLEAR = 'CLEAR',
  REPLACE = 'REPLACE',
  APPEND = 'APPEND'
}