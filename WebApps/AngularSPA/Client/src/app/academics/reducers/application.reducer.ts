import { AcademicsActionsUnion } from '../actions/actions';

export interface State {

}

export const initialState: State = {

}

export function reducer(state = initialState, action: AcademicsActionsUnion): State {
    switch (action.type) {
        default: {
            return state;
        }
    }
}