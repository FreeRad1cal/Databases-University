import { Action } from '@ngrx/store';
import { RootActionTypes, RootActionsUnion } from '../actions/actions';

export interface State {
    busy: boolean;
    errors: string[];
}

export const initialState: State = {
    busy: false,
    errors: []
}

export function reducer(state = initialState, action: RootActionsUnion): State {
    switch (action.type) {
        case RootActionTypes.SetGlobalBusy:
            return {
                ...state,
                busy: action.payload.value
            };
        case RootActionTypes.SetGlobalErrors:
            return {
                ...state,
                errors: action.payload.errors
            }
        default:
            return state;
    }
}

export const selectGlobalBusy = (state: State) => state.busy;
export const setGlobalErrors = (state: State) => state.errors;