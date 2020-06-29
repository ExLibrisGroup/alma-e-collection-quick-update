export class Options {
  isFree: Option[] = [];
  booleanYesNo: Option[] = [];
  booleanYesNoNumericCode: Option[] = [];
  collectionAccessType: Option[] = [];
  counterPlatform: Option[] = [];
  proxies: Option[] = [];
  licenses: Option[] = [];
}

export interface Option {
  code: string;
  desc: string;
}

