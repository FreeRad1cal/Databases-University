import { Action } from '@ngrx/store';
import { RootActionTypes, RootActionsUnion } from '../actions/actions';
import { Pagination } from '../models/Pagination';

export interface State {
    busy: boolean;
    paginations: {[index: string]: Pagination}
}

export const initialState: State = {
    busy: false,
    paginations: {}
}

export function reducer(state = initialState, action: RootActionsUnion): State {
    switch (action.type) {
        case RootActionTypes.SetGlobalBusy:
            return {
                ...state,
                busy: action.payload.value
            };
        case RootActionTypes.Paginate:
            return {
                ...state,
                paginations: {...state.paginations, [action.payload.key]: action.payload.pagination}
            }
        default:
            return state;
    }
}

export const selectGlobalBusy = (state: State) => state.busy;
export const selectPagination = (key: string) => (state: State) => state.paginations[key] ? state.paginations[key] : Pagination.Default;