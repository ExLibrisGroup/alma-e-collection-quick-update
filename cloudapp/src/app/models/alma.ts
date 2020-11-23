export interface CodeTable {
  name: string;
  description: string;
  language: {
    desc: string;
    valiue: string;
  };
  row: {
    code: string;
    description: string;
    default: boolean;
    enabled: boolean;
  }[]
}

export interface Licenses {
  total_record_count: number;
  license: License[]
}

export interface License {
  code: string;
  name: string;
}

export interface IntegrationProfiles {
  total_record_count: number;
  integration_profile: IntegrationProfile[]
}

export interface IntegrationProfile {
  code: string;
  description: string;
}

export interface Library {
  code: string;
  description: string;
  name: string;
}