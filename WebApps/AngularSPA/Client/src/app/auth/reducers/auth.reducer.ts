import { AuthActionsUnion, AuthActionTypes } from "../actions/auth.actions";
import { Person } from '../models/Person';

export interface State {
    signedInUser: Person;
    expires: Date;
    token: string;
}

export const initialState: State = {
    signedInUser: null,
    expires: new Date(),
    token: null
}

export function reducer(state = initialState, action: AuthActionsUnion): State {
    switch (action.type) {
        case AuthActionTypes.SignInSuccess: {
          return {
            ...state,
            signedInUser: action.payload.user,
            expires: action.payload.expires,
            token: action.payload.token
          };
        }
        
        case AuthActionTypes.SignOut: {
          return initialState;
        }

        default: {
          return state;
        }
      }
}

export const selectIsSignedIn = (state: State) => state.signedInUser != null && state.expires > new Date();
export const selectSignedInUser = (state: State) => state.signedInUser;
export const selectToken = (state: State) => state.token;