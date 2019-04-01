import { Action } from '@ngrx/store';

export enum AcademicsActionTypes {
    SubmitApplication = '[Academics] Submit Application'
}

export class SubmitApplication implements Action {
    readonly type = AcademicsActionTypes.SubmitApplication;

    constructor(public payload: {semesterId: string, detail: string}) {}
}

export type AcademicsActionsUnion = 
    SubmitApplication;