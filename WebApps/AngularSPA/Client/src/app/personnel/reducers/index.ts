import * as fromJobSearch from './job-search.reducer';
import * as fromJobApplication from './job-application.reducer';
import * as fromPersonnelRoot from './personnel.reducer';
import * as fromRoot from '../../reducers';
import { ActionReducerMap, createFeatureSelector, createSelector } from '@ngrx/store';

export interface PersonnelState {
    root: fromPersonnelRoot.State;
    jobSearch: fromJobSearch.State;
    jobApplication: fromJobApplication.State;
}

export interface State extends fromRoot.State {
    personnel: PersonnelState;
}

export const reducers: ActionReducerMap<PersonnelState> = {
    root: fromPersonnelRoot.reducer,
    jobSearch: fromJobSearch.reducer,
    jobApplication: fromJobApplication.reducer
}

export const selectPersonnelState = createFeatureSelector<PersonnelState>('personnel');

// Personnel root

export const selectPersonnelRootState = createSelector(
    selectPersonnelState,
    (state: PersonnelState) => state.root
)

export const getJobTiles = createSelector(
    selectPersonnelRootState,
    fromPersonnelRoot.jobTitleEntitySelectors.selectAll
)

export const getJobTitleByName = (name: string) => createSelector(
    selectPersonnelRootState,
    fromPersonnelRoot.selectJobTitleByName(name)
)

export const getTotalJobTitles = createSelector(
    selectPersonnelRootState,
    fromPersonnelRoot.selectTotalJobTitles
)

export const getJobPostings = createSelector(
    selectPersonnelRootState,
    fromPersonnelRoot.jobPostingEntitySelectors.selectAll
)

export const getJobPostingById = (id: string) => createSelector(
    selectPersonnelRootState,
    fromPersonnelRoot.selectJobPostingById(id)
)

export const getTotalJobPostings = createSelector(
    selectPersonnelRootState,
    fromPersonnelRoot.selectTotalJobPostings
)

export const getJobApplications = createSelector(
    selectPersonnelRootState,
    fromPersonnelRoot.jobApplicationEntitySelectors.selectAll
)

export const getJobApplicationById = (id: string) => createSelector(
    selectPersonnelRootState,
    fromPersonnelRoot.selectJobApplicationById(id)
)

export const getTotalJobApplications = createSelector(
    selectPersonnelRootState,
    fromPersonnelRoot.selectTotalJobApplications
)

// Job Search

export const selectJobSearch = createSelector(
    selectPersonnelState,
    (state: PersonnelState) => state.jobSearch
)

export const getJobSearchPagination = createSelector(
    selectJobSearch,
    fromJobSearch.selectPagination
)

export const getJobSearchErrors = createSelector(
    selectJobSearch,
    fromJobSearch.selectErrors
)

export const getLastJobSearchQuery = createSelector(
    selectJobSearch,
    fromJobSearch.selectLastQuery
)

// Job Application

export const selectJobApplication = createSelector(
    selectPersonnelState,
    (state: PersonnelState) => state.jobApplication
)

export const getJobApplicationErrors = createSelector(
    selectJobApplication,
    fromJobApplication.selectErrors
)

export const getLastJobApplicationAction = createSelector(
    selectJobApplication,
    fromJobApplication.getLastApplicationAction
)