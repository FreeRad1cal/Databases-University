import { Action } from '@ngrx/store';
import { RootActionTypes, RootActionsUnion } from '../actions/actions';

export interface State {
    busy: boolean;
}

export const initialState: State = {
    busy: false
}

export function reducer(state = initialState, action: RootActionsUnion): State {
    switch (action.type) {
        case RootActionTypes.SetGlobalBusy:
            return {
                ...state,
                busy: action.payload.value
            };
        default:
            return state;
    }
}

export const selectGlobalBusy = (state: State) => state.busy;