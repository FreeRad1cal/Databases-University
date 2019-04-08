import * as fromJobSearch from './job-search.reducer';
import * as fromPersonnelRoot from './personnel.reducer';
import * as fromRoot from '../../reducers';
import { ActionReducerMap, createFeatureSelector, createSelector } from '@ngrx/store';

export interface PersonnelState {
    root: fromPersonnelRoot.State;
    jobSearch: fromJobSearch.State;
}

export interface State extends fromRoot.State {
    personnel: PersonnelState;
}

export const reducers: ActionReducerMap<PersonnelState> = {
    root: fromPersonnelRoot.reducer,
    jobSearch: fromJobSearch.reducer
}

export const selectPersonnelState = createFeatureSelector<PersonnelState>('personnel');

export const selectPersonnelRootState = createSelector(
    selectPersonnelState,
    (state: PersonnelState) => state.root
)

export const getJobTiles = createSelector(
    selectPersonnelRootState,
    fromPersonnelRoot.selectJobTitles
)

export const selectJobSearch = createSelector(
    selectPersonnelState,
    (state: PersonnelState) => state.jobSearch
)

export const getPagination = createSelector(
    selectJobSearch,
    fromJobSearch.selectPagination
)

export const getJobPostings = createSelector(
    selectJobSearch,
    fromJobSearch.selectJobPostings
)

export const getJobPostingById = (id: string) => createSelector(
    selectJobSearch,
    fromJobSearch.selectJobPostingById(id)
)

export const getErrors = createSelector(
    selectJobSearch,
    fromJobSearch.selectErrors
)

export const getTotalJobPostings = createSelector(
    selectJobSearch,
    fromJobSearch.selectTotalJobPostings
)