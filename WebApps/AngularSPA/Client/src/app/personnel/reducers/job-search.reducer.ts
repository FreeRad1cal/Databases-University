import { JobPosting } from '../models/JobPosting';
import { PersonnelJobSearchActionsUnion, PersonnelJobSearchActionTypes } from '../actions/job-search.actions';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { JobSearchQuery } from '../models/JobSearchQuery';

export interface State {
    errors: string[];
    lastQuery: JobSearchQuery;
}

export const initialState = {
    errors: [],
    lastQuery: null
};

export function reducer(state = initialState, action: PersonnelJobSearchActionsUnion): State {
    switch (action.type) {
        case PersonnelJobSearchActionTypes.SearchFailed:
            return {
                ...state,
                errors: action.payload.errors
            }
        case PersonnelJobSearchActionTypes.Search:
            return {
                ...state,
                errors: [],
                lastQuery: action.payload.query
            }
        case PersonnelJobSearchActionTypes.Reset:
            return {
                ...initialState
            }
        default: {
            return state;
        }
    }
}

export const selectErrors = (state: State) => state.errors;
export const selectLastQuery = (state: State) => state.lastQuery;