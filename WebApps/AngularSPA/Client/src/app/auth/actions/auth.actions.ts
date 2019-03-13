import { Action } from "@ngrx/store";
import { Person } from '../models/Person';

export enum AuthActionTypes {
    SignIn = '[Auth] SignIn',
    SignOut = '[Auth] SignOut',
    SignInSuccess = '[Auth] SignIn Success',
    SignInFailure = '[Auth] SignIn Failure',
    SetToken = '[Auth] Set Token',
    InitUser = '[Auth] Init User'
}

export class SignIn implements Action {
    readonly type = AuthActionTypes.SignIn;

    constructor(public payload: { userName: string, password: string}) {}
}

export class SignInSuccess implements Action {
    readonly type = AuthActionTypes.SignInSuccess;
  
    constructor(public payload: { user: Person }) {}
}

export class SignInFailure implements Action {
    readonly type = AuthActionTypes.SignInFailure;

    constructor(public payload: { errors: string[] }) {}
}

export class SignOut implements Action {
    readonly type = AuthActionTypes.SignOut;
}

export class SetToken implements Action {
    readonly type = AuthActionTypes.SetToken;

    constructor(public payload: {token: string, expires: Date}) {}
}

export class InitUser implements Action {
    readonly type = AuthActionTypes.InitUser;
}

export type AuthActionsUnion =
  | SignIn
  | SignInSuccess
  | SignInFailure
  | SetToken
  | SignOut
  | InitUser;