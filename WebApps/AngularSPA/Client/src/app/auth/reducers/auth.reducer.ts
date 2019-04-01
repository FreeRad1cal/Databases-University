import { AuthActionsUnion, AuthActionTypes } from "../actions/auth.actions";
import { Person } from '../models/Person';
import { JwtHelper } from '../helpers/JwtHelper';

export interface State {
    signedInUser: Person;
    expires: Date;
    token: string;
    busy: boolean;
    loginErrors: string[];
    registrationErrors: string[];
    registrationSuccess: boolean;
}

export const initialState: State = {
    signedInUser: null,
    expires: new Date(),
    token: null,
    busy: false,
    loginErrors: [],
    registrationErrors: [],
    registrationSuccess: false
}

export function reducer(state = initialState, action: AuthActionsUnion): State {
    switch (action.type) {
        case AuthActionTypes.SignInSuccess: {
          return {
            ...state,
            signedInUser: action.payload.user,
            busy: false
          };
        }

        case AuthActionTypes.CompleteSignIn: {
          return {
            ...state,
            token: action.payload.token,
            expires: JwtHelper.getExpiration(action.payload.token)
          }
        }
        
        case AuthActionTypes.SignOut: {
          return {
            ...initialState,
            loginErrors: state.loginErrors
          };
        }

        case AuthActionTypes.SignIn: {
          return {
            ...initialState,
            busy: true
          };
        }

        case AuthActionTypes.SignInFailure: {
          return {
            ...initialState,
            loginErrors: action.payload.errors
          }
        }
        
        case AuthActionTypes.Register: {
          return {
            ...state,
            busy: true,
            registrationSuccess: false
          }
        }

        case AuthActionTypes.RegistrationFailure: {
          return {
            ...state,
            busy: false,
            registrationErrors: action.payload.errors
          }
        }

        case AuthActionTypes.RegistrationSuccess: {
          return {
            ...state,
            busy: false,
            registrationErrors: [],
            registrationSuccess: true
          }
        }

        default: {
          return state;
        }
      }
}

export const selectIsSignedIn = (state: State) => state.signedInUser != null && state.expires > new Date();
export const selectSignedInUser = (state: State) => state.signedInUser;
export const selectToken = (state: State) => state.token;
export const selectRoles = (state: State) => JwtHelper.getRoles(selectToken(state));
export const selectPermissions = (state: State) => JwtHelper.getRoles(selectToken(state));
export const selectBusy = (state: State) => state.busy
export const selectLoginErrors = (state: State) => state.loginErrors;
export const selectRegistrationErrors = (state: State) => state.registrationErrors;
export const selectRegistrationSuccess = (state: State) => state.registrationSuccess;