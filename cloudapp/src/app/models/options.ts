export class Options {
  isFree: Option[] = [];
  booleanYesNo: Option[] = [];
  booleanYesNoNumericCode: Option[] = [];
  collectionAccessType: Option[] = [];
  counterPlatform: Option[] = [];
  proxies: Option[] = [];
  licenses: Option[] = [];
  libraries: Option[] = [];
  electronicBaseStatus : Option[]=[];
  urlTypes: Option[] =[{code:'param',desc:'Parameter'},{code:'dynamic',desc:'Dynamic'}]; //TOOD Check about adding code table to alma
}

export interface Option {
  code: string;
  desc: string;
}

