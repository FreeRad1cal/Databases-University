import { AcademicsActionsUnion, AcademicsActionTypes } from '../actions/actions';
import { Application } from '../models/Application';
import { Semester } from '../models/Semester';

export interface State {
    semesters: Semester[],
}

export const initialState: State = {
    semesters: [],
}

export function reducer(state = initialState, action: AcademicsActionsUnion): State {
    switch (action.type) {
        case AcademicsActionTypes.AcademicsRootInitialized:
            return {
                ...initialState,
                semesters: action.payload.semesters
            }
        default: {
            return state;
        }
    }
}

export const selectSemesters = (state: State) => state.semesters;
