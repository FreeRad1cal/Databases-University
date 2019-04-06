import * as fromApplication from './application.reducer';
import * as fromAcademicsRoot from './academics.reducer';
import * as fromRoot from '../../reducers';
import { ActionReducerMap, createFeatureSelector, createSelector } from '@ngrx/store';

export interface AcademicsState {
    root: fromAcademicsRoot.State;
    application: fromApplication.State;
}

export interface State extends fromRoot.State {
    academics: AcademicsState;
}

export const reducers: ActionReducerMap<AcademicsState> = {
    root: fromAcademicsRoot.reducer,
    application: fromApplication.reducer
}

export const selectAcademicsState = createFeatureSelector<AcademicsState>('academics');

export const selectApplicationState = createSelector(
    selectAcademicsState,
    (state: AcademicsState) => state.application
)

export const selectRootState = createSelector(
    selectAcademicsState,
    (state: AcademicsState) => state.root
)

export const getSemesters = createSelector(
    selectRootState,
    fromAcademicsRoot.selectSemesters
)

export const getDraftApplication = createSelector(
    selectApplicationState,
    fromApplication.selectDraftApplication
)

export const getSubmissionSuccess = createSelector(
    selectApplicationState,
    fromApplication.selectSubmissionSuccess
)

export const getSubmittedApplicationId = createSelector(
    selectApplicationState,
    fromApplication.selectSubmittedApplicationId
)