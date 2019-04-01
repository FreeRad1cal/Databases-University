import { Action } from "@ngrx/store";
import { Person } from '../models/Person';
import { LoginCredentials } from '../models/LoginCredentials';

export enum AuthActionTypes {
    SignIn = '[Auth] SignIn',
    SignOut = '[Auth] SignOut',
    SignInSuccess = '[Auth] SignIn Success',
    SignInFailure = '[Auth] SignIn Failure',
    InitUser = '[Auth] Init User',
    CompleteSignIn = '[Auth] Complete SignIn',
    Register = '[Auth] Register',
    RegistrationSuccess = '[Auth] Registration Success',
    RegistrationFailure = '[Auth] Registration Failure'
}

export class SignIn implements Action {
    readonly type = AuthActionTypes.SignIn;

    constructor(public payload: { credentials: LoginCredentials }) {}
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

export class InitUser implements Action {
    readonly type = AuthActionTypes.InitUser;
}

export class CompleteSignIn implements Action {
    readonly type = AuthActionTypes.CompleteSignIn;

    constructor(public payload: { token: string }) {}
}

export class Register implements Action {
    readonly type = AuthActionTypes.Register;

    constructor(public payload: { person: Person }) {}
}

export class RegistrationSuccess implements Action {
    readonly type = AuthActionTypes.RegistrationSuccess;
}

export class RegistrationFailure implements Action {
    readonly type = AuthActionTypes.RegistrationFailure;

    constructor(public payload: { errors: string[] }) {}
}

export type AuthActionsUnion =
  SignIn
  | SignInSuccess
  | SignInFailure
  | SignOut
  | InitUser
  | CompleteSignIn
  | Register
  | RegistrationSuccess
  | RegistrationFailure;