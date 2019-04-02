import {
    ActionReducerMap,
    createSelector,
    createFeatureSelector,
    ActionReducer,
    MetaReducer,
  } from '@ngrx/store';
import { environment } from '../../environments/environment';
import * as fromRouter from '@ngrx/router-store';
import { storeFreeze } from 'ngrx-store-freeze';
import * as fromRoot from './app.reducer';

export interface State {
  router: fromRouter.RouterReducerState;
  root: fromRoot.State
}

export const reducers: ActionReducerMap<State> = {
    router: fromRouter.routerReducer,
    root: fromRoot.reducer
};

export function logger(reducer: ActionReducer<State>): ActionReducer<State> {
    return function(state: State, action: any): State {
      console.log('state', state);
      console.log('action', action);
  
      return reducer(state, action);
    };
}

export const metaReducers: MetaReducer<State>[] = !environment.production
  ? [logger, storeFreeze]
  : [];

export const getGlobalBusy = createSelector(
  (state: State) => state.root,
  fromRoot.selectGlobalBusy
)