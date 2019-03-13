import { Action } from "@ngrx/store";
import { Person } from '../models/Person';

export enum AuthActionTypes {
    SignIn = '[Auth] SignIn',
    SignOut = '[Auth] SignOut',
    SignInSuccess = '[Auth] SignIn Success',
    SignInFailure = '[Auth] SignIn Failure',
    AuthFailure = '[Auth] Auth Failure'
}

export class SignIn implements Action {
    readonly type = AuthActionTypes.SignIn;

    constructor(public payload: { userName: string, password: string}) {}
}

export class SignInSuccess implements Action {
    readonly type = AuthActionTypes.SignInSuccess;
  
    constructor(public payload: { user: Person, expires: Date, token: string }) {}
}

export class SignInFailure implements Action {
    readonly type = AuthActionTypes.SignInFailure;

    constructor(public payload: { errors: string[] }) {}
}

export class SignOut implements Action {
    readonly type = AuthActionTypes.SignOut;
}

export class AuthFailure implements Action {
    readonly type = AuthActionTypes.AuthFailure;
}

export type AuthActionsUnion =
  | SignIn
  | SignInSuccess
  | SignInFailure
  | AuthFailure
  | SignOut;