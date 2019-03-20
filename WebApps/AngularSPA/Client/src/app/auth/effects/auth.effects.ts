import { Injectable } from "@angular/core";
import { Actions, Effect, ofType, OnInitEffects } from "@ngrx/effects";
import { map, tap, switchMap, filter, debounceTime, catchError } from 'rxjs/operators';
import { Store, Action } from "@ngrx/store";
import { JwtPersisterService } from '../services/jwt-persister.service';
import { InitUser, AuthActionTypes, SignInSuccess, SignOut, SignIn, CompleteSignIn, SignInFailure } from '../actions/auth.actions';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { JwtHelper } from '../helpers/JwtHelper';
import { Router } from '@angular/router';
import { of } from 'rxjs';

@Injectable()
export class AuthEffects implements OnInitEffects {

    @Effect()
    initUser$ = this.actions$.pipe(
        ofType<InitUser>(AuthActionTypes.InitUser),
        map(() => {
            const rawJwt = this.jwtPersister.getPersistedToken();
            if (JwtHelper.validateJwt(rawJwt)) {
                return new CompleteSignIn({ token: rawJwt })
            }
            return new SignOut();
        })
    );

    @Effect()
    completeSignIn$ = this.actions$.pipe(
        ofType<CompleteSignIn>(AuthActionTypes.CompleteSignIn),
        switchMap(() => this.authService.getMe().pipe(
            catchError(res => of(res)),
            map(res => {
                if (res instanceof HttpErrorResponse) {
                    let msg = res.status == 401 || res.status == 403 ? 
                    "Authentication error. Please log in again." :
                    "An error occured while communicating with the server";
                    return new SignInFailure({ error: msg })
                }
                return new SignInSuccess({user: res.body});
            })
        ))
    )

    @Effect()
    signIn$ = this.actions$.pipe(
        ofType<SignIn>(AuthActionTypes.SignIn),
        debounceTime(1000),
        switchMap(action => 
            this.authService.authenticate(action.payload.credentials).pipe(
                catchError(res => of(res)),
                map(res => {
                    if (res instanceof HttpErrorResponse) {
                        if (res.status == 401){
                            return new SignInFailure({ error: "Invalid username or password" });
                        }
                        return new SignInFailure({ error: "An error occured while communicating with the server" })
                    }
                    return new CompleteSignIn({ token: res.body });
                })
            ))
        
    )

    @Effect({ dispatch: false })
    signOut$ = this.actions$.pipe(
        tap(() => this.jwtPersister.clearPersistedToken()),
        tap(() => this.router.navigate(['login']))
    );

    constructor(
        private actions$: Actions,
        private jwtPersister: JwtPersisterService,
        private authService: AuthService,
        private store: Store<any>,
        private router: Router) {}

    ngrxOnInitEffects(): Action {
        return new InitUser();
    }
}