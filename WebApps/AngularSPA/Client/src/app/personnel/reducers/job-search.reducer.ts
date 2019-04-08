import { JobPosting } from '../models/JobPosting';
import { PersonnelJobSearchActionsUnion, PersonnelJobSearchActionTypes, ResetJobSearch } from '../actions/job-search.actions';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';

export interface State extends EntityState<JobPosting> {
    page: number;
    limit: number;
    offset: number;
    errors: string[];
    totalJobPostings: number;
    hasSearched: boolean;
}

export const adapter: EntityAdapter<JobPosting> = createEntityAdapter<JobPosting>();

export const initialState: State = adapter.getInitialState({
    page: 0,
    limit: 25,
    offset: 0,
    errors: [],
    totalJobPostings: 0,
    hasSearched: false
});

export function reducer(state = initialState, action: PersonnelJobSearchActionsUnion): State {
    switch (action.type) {
        case PersonnelJobSearchActionTypes.SetPagination:
            return {
                ...state,
                limit: action.payload.pagination.limit,
                offset: action.payload.pagination.offset
            }
        case PersonnelJobSearchActionTypes.SearchCompleted:{
            let newState = adapter.addAll(action.payload.postings, state);
            newState.totalJobPostings = action.payload.totalPostings;
            return newState;
        }
        case PersonnelJobSearchActionTypes.SearchFailed:
            return {
                ...state,
                errors: action.payload.errors
            }
        case PersonnelJobSearchActionTypes.ResetJobSearch:
            return {
                ...initialState
            }
        case PersonnelJobSearchActionTypes.Search:
            return {
                ...initialState,
                hasSearched: true
            }
        default: {
            return state;
        }
    }
}

const {
    selectAll,
    selectTotal
  } = adapter.getSelectors();

export const selectPagination = (state: State) => { return {page: state.page, limit: state.limit, offset: state.offset} };
export const selectJobPostings = selectAll;
export const selectJobPostingById = (id: string) => (state: State) => selectAll(state).filter(posting => posting.id == id)[0];
export const selectErrors = (state: State) => state.errors;
export const selectTotalJobPostings = (state: State) => state.totalJobPostings;
export const selectHasSearched = (state: State) => state.hasSearched