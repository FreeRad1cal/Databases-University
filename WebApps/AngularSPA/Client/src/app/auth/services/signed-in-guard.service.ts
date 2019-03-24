import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { getSignedInUser, getIsSignedIn } from '../reducers';

@Injectable({
  providedIn: 'root'
})
export class SignedInGuard implements CanActivate {

  constructor(private store: Store<any>, private router: Router) { }

  canActivate(): Observable<boolean> {
    return this.store.pipe(
      select(getIsSignedIn),
      // tap(signedIn => {
      //   if (!signedIn) this.router.navigate(['login'])
      // })
    );
  }
}