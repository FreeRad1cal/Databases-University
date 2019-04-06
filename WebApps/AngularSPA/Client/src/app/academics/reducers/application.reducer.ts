import { AcademicsActionsUnion, AcademicsActionTypes } from '../actions/actions';
import { Application } from '../models/Application';
import { Semester } from '../models/Semester';

export interface State {
    draft: Application,
    submissionSuccess: boolean;
    submittedApplicationId: string;
    applicationErrors: string[];
}

export const initialState: State = {
    draft: null,
    submissionSuccess: false,
    submittedApplicationId: null,
    applicationErrors: []
}

export function reducer(state = initialState, action: AcademicsActionsUnion): State {
    switch (action.type) {
        case AcademicsActionTypes.ApplicationInitialized:
            return {
                ...initialState,
                draft: action.payload.draft
            }
        default: {
            return state;
        }
    }
}

export const selectDraftApplication = (state: State) => state.draft;
export const selectSubmissionSuccess = (state: State) => state.submissionSuccess;
export const selectSubmittedApplicationId = (state: State) => state.submittedApplicationId;