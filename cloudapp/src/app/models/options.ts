export class Options {
  isFree: Option[] = [];
  booleanYesNo: Option[] = [];
  booleanYesNoNumericCode: Option[] = [];
  collectionAccessType: Option[] = [];
  counterPlatform: Option[] = [];
  proxies: Option[] = [];
  licenses: Option[] = [];
  publicAccessModel: Option[] = [];
  libraries: Option[] = [];
  electronicBaseStatus : Option[]=[];
  // TODO: Check about adding code table to alma
  urlTypes: Option[] = [
    { code: 'param', desc: 'Parameter' },
    { code: 'dynamic', desc: 'Dynamic' }
  ]; 
  deactivate: Option[] = [
    { code: 'deactivate_all', desc: 'Deactivate' },
    { code: 'keep_active_all', desc: 'Keep all active' },
    { code: 'keep_active_perpetual', desc: 'Keep perpetual access portfolios active' }
  ]; 
}

export interface Option {
  code: string;
  desc: string;
}

