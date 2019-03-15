import { AuthActionsUnion, AuthActionTypes } from "../actions/auth.actions";
import { Person } from '../models/Person';
import { JwtHelper } from '../helpers/JwtHelper';

export interface State {
    signedInUser: Person;
    expires: Date;
    token: string;
    busy: boolean;
    error: string;
}

export const initialState: State = {
    signedInUser: null,
    expires: new Date(),
    token: null,
    busy: false,
    error: null
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
          return initialState;
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
            error: action.payload.error
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
export const selectBusy = (state: State) => state.busy
export const selectError = (state: State) => state.error;