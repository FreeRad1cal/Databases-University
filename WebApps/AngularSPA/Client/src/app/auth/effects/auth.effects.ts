import { Injectable } from "@angular/core";
import { Actions, Effect, ofType, OnInitEffects } from "@ngrx/effects";
import { map, tap, switchMap, filter, debounceTime, catchError, withLatestFrom } from 'rxjs/operators';
import { Store, Action } from "@ngrx/store";
import { JwtPersisterService } from '../services/jwt-persister.service';
import { InitUser, AuthActionTypes, SignInSuccess, SignOut, SignIn, CompleteSignIn, SignInFailure, Register, RegistrationFailure, RegistrationSuccess } from '../actions/auth.actions';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { JwtHelper } from '../helpers/JwtHelper';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { getToken } from '../reducers';

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
                    const errors = res.error && res.error.errors ? res.error.errors : ["An error has occured"];
                    return new SignInFailure({ errors: errors })
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
                        const errors = res.error.errors && res.error.errors? res.error.errors : ["An error has occured"];
                            return new SignInFailure({ errors: errors });
                    }
                    return new CompleteSignIn({ token: res.body });
                })
            ))
        
    )

    @Effect({ dispatch: false })
    signOut$ = this.actions$.pipe(
        ofType<SignOut>(AuthActionTypes.SignOut),
        tap(() => this.jwtPersister.clearPersistedToken()),
        tap(() => this.router.navigate(['login']))
    );

    @Effect({ dispatch: false})
    signInSuccess$ = this.actions$.pipe(
        ofType<SignInSuccess>(AuthActionTypes.SignInSuccess),
        withLatestFrom(this.store.select(getToken)),
        tap(([_, token]) => this.jwtPersister.persistToken(token)),
        tap(() => this.router.navigate(['home']))
    );

    @Effect()
    register$ = this.actions$.pipe(
        ofType<Register>(AuthActionTypes.Register),
        switchMap(action => this.authService.register(action.payload.person)),
        catchError(res => of(res)),
        map(res => {
            if (res instanceof HttpErrorResponse) {
                const errors = res.error.errors && res.error.errors? res.error.errors : ["An error has occured"];
                    return new RegistrationFailure({ errors: errors });
            }
            return new RegistrationSuccess();
        })
    )

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