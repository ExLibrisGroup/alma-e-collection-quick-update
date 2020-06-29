import { Observable, of } from "rxjs";
import { catchError } from "rxjs/operators";

const withErrorChecking = (obs: Observable<any>, obj: Object = {}): Observable<any> => {
  obj = Object.assign(obj, {isError: true});
  return obs.pipe(catchError( e => of(Object.assign(e, obj)) ));
}

export { withErrorChecking };