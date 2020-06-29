import { Injectable } from '@angular/core';
import { Options } from '../models/options';
import { Observable, iif, of, forkJoin } from 'rxjs';
import { CloudAppRestService } from '@exlibris/exl-cloudapp-angular-lib';
import { tap, switchMap, map } from 'rxjs/operators';

@Injectable()
export class OptionsService {
  private codes = [
    'IsFree',
    'BooleanYesNoNumericCode',
    'CollectionAccessType',
    'CounterPlatform',
    'BooleanYesNo'
  ]
  private _options: Options;

  constructor(
    private restService: CloudAppRestService
  ) { }

  get options(): Observable<Options> {
    return iif(
      ()=>this._options!=undefined, 
      of(this._options),
      forkJoin(
        /* Code tables */
        this.codes.map(key=>this.restService.call(`/conf/code-tables/${key}`))
      )
      .pipe(
        tap(results=> {
          this._options = new Options();
          results.forEach(table => 
            this._options[table.name.charAt(0).toLowerCase() + table.name.slice(1)] = 
              table.row.map(r=>({code: r.code, desc: r.description}))
              .sort(sort('desc'))
          )
        }),
        /* Other APIs */
        switchMap(()=>forkJoin([
          this.restService.call('/conf/integration-profiles?type=PROXY_DEFINITION'),
          /* TODO: Retrieve in chunks for > 100 */
          this.restService.call('/acq/licenses?limit=100')
        ])),
        tap(results=>{
          this._options.proxies = 
            results[0].integration_profile.map(p=>({code: p.code, desc: p.code.concat(p.description ? ` (${p.description})` : '')}))
            .sort(sort('desc'));
          this._options.licenses = 
            results[1].license.map(l=>({code: l.code, desc: l.name}))
            .sort(sort('desc'));
        }),
        map(()=>this._options)
      )
    )
  }
}

const sort = (field: string) => ( a: any, b: any ) => {
  if ( a[field] < b[field] ) return -1;
  if ( a[field] > b[field] ) return 1;
  return 0;
}