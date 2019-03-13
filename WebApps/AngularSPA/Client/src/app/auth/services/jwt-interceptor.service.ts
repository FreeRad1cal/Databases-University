import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import * as fromAuth from '../reducers';
import { Store, select } from '@ngrx/store';
import { take, map, mergeMap, filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class JwtInterceptorService implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (req.url.startsWith(environment.personnelApi)) {
      return this.store.pipe(
        select(fromAuth.getToken),
        take(1),
        mergeMap(token => next.handle(this.setBearer(req, token)))
      )
    }
    
    return next.handle(req);
  }
  
  constructor(private store: Store<fromAuth.State>) { }

  private setBearer(req: HttpRequest<any>, token: string): HttpRequest<any> {
    return req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }
}
