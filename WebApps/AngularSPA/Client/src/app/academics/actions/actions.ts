import { Action } from '@ngrx/store';
import { Application } from '../models/Application';
import { Semester } from '../models/Semester';

export enum AcademicsActionTypes {
    SubmitApplication = '[Academics] Submit Application',
    SaveDraftApplication = '[Academics] Save Draft Application',
    InitializeApplication = '[Academics] Initialize Application',
    ApplicationInitialized = '[Academics] Application Initialized'
}

export class SubmitApplication implements Action {
    readonly type = AcademicsActionTypes.SubmitApplication;

    constructor(public payload: {semesterId: string, detail: string}) {}
}

export class SaveDraftApplication implements Action {
    readonly type = AcademicsActionTypes.SaveDraftApplication;

    constructor(public payload: {application: Application}) {}
}

export class InitializeApplication implements Action {
    readonly type = AcademicsActionTypes.InitializeApplication;
}

export class ApplicationInitialized implements Action {
    readonly type = AcademicsActionTypes.ApplicationInitialized;

    constructor(public payload: {draft: Application, semesters: Semester[]}) {}
}

export type AcademicsActionsUnion = 
    SubmitApplication
    | SaveDraftApplication
    | InitializeApplication
    | ApplicationInitialized;