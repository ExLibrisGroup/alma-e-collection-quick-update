export class ECollection {
  internal_description: string = "";
  proxy_enabled: Value = new Value();
  free: Value = new Value();
  proxy: string = "";
  category: string = "";
  access_type: Value = new Value();
  counter_platform: Value = new Value();
  license: Value = new Value();
  activation_date: string = "";
  expected_activation_date: string = "";
}

export class Value {
  value: string = ""
}
