import { Injectable } from "@angular/core";
import { Actions, Effect, ofType, OnInitEffects } from "@ngrx/effects";
import { map, tap, switchMap } from 'rxjs/operators';
import { Store, Action } from "@ngrx/store";
import { JwtPersisterService } from '../services/jwt-persister.service';
import { SetToken, InitUser, AuthActionTypes, SignInSuccess, SignOut } from '../actions/auth.actions';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthEffects implements OnInitEffects {

    @Effect()
    initUser$ = this.actions$.pipe(
        ofType<InitUser>(AuthActionTypes.InitUser),
        tap(() => {
            const rawJwt = this.tokenPersister.getToken();
            if (this.authService.validateJwt(rawJwt)) {
                this.store.dispatch(new SetToken({token: rawJwt, expires: this.authService.getExpiration(rawJwt) }));
            }
        }),
        switchMap(() => this.authService.getMe().pipe(
            map(res => {
                if (res instanceof HttpErrorResponse) {
                    return new SignOut();
                }
                return new SignInSuccess({user: res.body});
            })
        ))
    );

    constructor(
        private actions$: Actions,
        private tokenPersister: JwtPersisterService,
        private authService: AuthService,
        private store: Store<any>    ) {}

    ngrxOnInitEffects(): Action {
        return new InitUser();
    }
}