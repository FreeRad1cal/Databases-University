import * as fromApplication from './application.reducer';
import * as fromRoot from '../../reducers';
import { ActionReducerMap, createFeatureSelector, createSelector } from '@ngrx/store';

export interface AcademicsState {
    application: fromApplication.State
}

export interface State extends fromRoot.State {
    academics: AcademicsState
}

export const reducers: ActionReducerMap<AcademicsState> = {
    application: fromApplication.reducer
}

export const selectAcademicsState = createFeatureSelector<AcademicsState>('academics');

export const selectAcademicsApplicationState = createSelector(
    selectAcademicsState,
    (state: AcademicsState) => state.application
)