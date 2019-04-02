import { AcademicsActionsUnion, AcademicsActionTypes } from '../actions/actions';
import { Application } from '../models/Application';
import { Semester } from '../models/Semester';

export interface State {
    draft: Application,
    semesters: Semester[],
    submissionSuccess: boolean;
    submittedApplicationId: string;
}

export const initialState: State = {
    draft: null,
    semesters: [],
    submissionSuccess: false,
    submittedApplicationId: null
}

export function reducer(state = initialState, action: AcademicsActionsUnion): State {
    switch (action.type) {
        case AcademicsActionTypes.ApplicationInitialized:
            return {
                ...initialState,
                draft: action.payload.draft,
                semesters: action.payload.semesters
            }
        default: {
            return state;
        }
    }
}