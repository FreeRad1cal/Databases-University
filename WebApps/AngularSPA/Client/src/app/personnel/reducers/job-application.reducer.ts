import { PersonnelApplicationActionsUnion, PersonnelApplicationActionTypes } from '../actions/job-application.actions';
import { JobApplication } from '../models/JobApplication';

export interface State {
    errors: string[];
    jobApplications: JobApplication[];
    totalJobApplications: number;
}

export const initialState: State = {
    errors: [],
    jobApplications: [],
    totalJobApplications: 0
};

export function reducer(state = initialState, action: PersonnelApplicationActionsUnion): State {
    switch (action.type) {
        case PersonnelApplicationActionTypes.ApplicationSubmissionFailure:
        {
            return {
                ...state,
                errors: action.payload.errors
            }
        }
        case PersonnelApplicationActionTypes.ResetJobApplication:
        {
            return {
                ...initialState
            }
        }
        case PersonnelApplicationActionTypes.JobApplicationsLoaded: {
            return {
                ...state,
                jobApplications: action.payload.jobApplications,
                totalJobApplications: action.payload.totalJobApplications
            }
        }
        default: {
            return state;
        }
    }
}

export const selectErrors = (state: State) => state.errors;
export const selectJobApplications = (state: State) => state.jobApplications;
