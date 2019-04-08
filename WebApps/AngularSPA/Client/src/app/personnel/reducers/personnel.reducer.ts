import { JobPosting } from '../models/JobPosting';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { JobTitle } from '../models/JobTitle';
import { PersonnelActionsUnion, PersonnelActionTypes } from '../actions/personnel-actions';

export interface State{
    jobTitles: JobTitle[]
}


export const initialState: State = {
    jobTitles: []
};

export function reducer(state = initialState, action: PersonnelActionsUnion): State {
    switch (action.type) {
        case PersonnelActionTypes.JobTitlesLoaded:
            return {
                ...state,
                jobTitles: action.payload.jobTitles
            }
        default: {
            return state;
        }
    }
}

export const selectJobTitles = (state: State) => state.jobTitles;