import { PersonnelApplicationActionsUnion, PersonnelApplicationActionTypes } from '../actions/job-application.actions';
import { JobApplication } from '../models/JobApplication';

export type JobApplicationAction = 'Withdraw' | 'Hire' | 'Reject';
export type JobApplicationActionDescriptor = {
  action: JobApplicationAction;
  id: string
}
export interface State {
    errors: string[];
    lastJobApplicationAction: JobApplicationActionDescriptor;
}

export const initialState: State = {
    errors: [],
    lastJobApplicationAction: null
};

export function reducer(state = initialState, action: PersonnelApplicationActionsUnion): State {
    switch (action.type) {
        case PersonnelApplicationActionTypes.SubmitJobApplication: {
            return {
                ...state,
                errors: []
            }
        }
        case PersonnelApplicationActionTypes.JobApplicationSubmissionFailure: {
            return {
                ...state,
                errors: action.payload.errors
            }
        }
        case PersonnelApplicationActionTypes.JobApplicationActionSuccess: {
            return {
                ...state,
                lastJobApplicationAction: action.payload.jobApplicationAction
            }
        }
        default: {
            return state;
        }
    }
}

export const selectErrors = (state: State) => state.errors;
export const getLastApplicationAction = (state: State) => state.lastJobApplicationAction
