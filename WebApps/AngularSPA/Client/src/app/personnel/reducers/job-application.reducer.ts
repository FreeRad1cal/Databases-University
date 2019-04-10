import { PersonnelApplicationActionsUnion, PersonnelApplicationActionTypes } from '../actions/job-application.actions';
import { JobApplication } from '../models/JobApplication';
import { JobApplicationActionDescriptor } from '../components/job-applications-result/job-applications-result.component';

export interface State {
    errors: string[];
    jobApplications: JobApplication[];
    totalJobApplications: number;
    lastJobApplicationAction: JobApplicationActionDescriptor
}

export const initialState: State = {
    errors: [],
    jobApplications: [],
    totalJobApplications: 0,
    lastJobApplicationAction: null
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
        case PersonnelApplicationActionTypes.ApplicationActionSuccess: {
            switch (action.payload.jobApplicationAction.action) {
              case 'withdraw':
                return {
                    ...state,
                    totalJobApplications: state.totalJobApplications - 1,
                    jobApplications: state.jobApplications.filter(app => app.id != action.payload.jobApplicationAction.id),
                    lastJobApplicationAction: action.payload.jobApplicationAction
                }
            }
        }
        default: {
            return state;
        }
    }
}

export const selectErrors = (state: State) => state.errors;
export const selectJobApplications = (state: State) => state.jobApplications;
export const getLastApplicationAction = (state: State) => state.lastJobApplicationAction
