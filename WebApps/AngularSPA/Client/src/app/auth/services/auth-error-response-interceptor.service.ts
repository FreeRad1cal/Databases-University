import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Store } from '@ngrx/store';
import * as fromAuth from '../reducers';
import * as fromAuthActions from '../actions/auth.actions';
import { tap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthErrorResponseInterceptorService {
   static readonly InterceptorSkipHeader = "X-AuthErrorResponseInterceptorSkip"

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (req.headers.has(AuthErrorResponseInterceptorService.InterceptorSkipHeader)) {
      const headers = req.headers.delete(AuthErrorResponseInterceptorService.InterceptorSkipHeader);
      return next.handle(req.clone({ headers }));
    }
    return next.handle(req).pipe(
      catchError(event => {
        if (event instanceof HttpErrorResponse && event.status == 401) {
          this.store.dispatch(new fromAuthActions.SignOut());
        }
        return throwError(event);
      })
    )
  }
  
  constructor(private store: Store<fromAuth.State>) { }

}
