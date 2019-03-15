import * as fromAuth from './auth.reducer';
import * as fromRoot from '../../reducers';
import { ActionReducerMap, createFeatureSelector, createSelector } from '@ngrx/store';

export interface AuthState {
    status: fromAuth.State,
}

export interface State extends fromRoot.State {
    auth: AuthState
}

export const reducers: ActionReducerMap<AuthState> = {
    status: fromAuth.reducer,
};

export const selectAuthState = createFeatureSelector<AuthState>('auth');

export const selectAuthStatusState = createSelector(
    selectAuthState,
    (state: AuthState) => state.status
);

export const getSignedInUser = createSelector(
    selectAuthStatusState,
    fromAuth.selectSignedInUser
);

export const getIsSignedIn = createSelector(
    selectAuthStatusState,
    fromAuth.selectIsSignedIn
);

export const getToken = createSelector(
    selectAuthStatusState,
    fromAuth.selectToken
);

export const getBusy = createSelector(
  selectAuthStatusState,
  fromAuth.selectBusy  
);

export const getError = createSelector(
    selectAuthStatusState,
    fromAuth.selectError
)