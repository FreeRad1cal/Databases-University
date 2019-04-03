import { Action } from '@ngrx/store';
import { Application } from '../models/Application';
import { Semester } from '../models/Semester';

export enum AcademicsActionTypes {
    InitializeAcademicsRoot = '[Academics] Initialize Academics Root',
    AcademicsRootInitialized = '[Academics] Academics Root Initialized',

    InitializeApplication = '[Academics] Initialize Application',
    ApplicationInitialized = '[Academics] Application Initialized',
    SubmitApplication = '[Academics] Submit Application',
    SaveDraftApplication = '[Academics] Save Draft Application',
}

export class InitializeAcademicsRoot implements Action {
    readonly type = AcademicsActionTypes.InitializeAcademicsRoot;
}

export class AcademicsRootInitialized implements Action {
    readonly type = AcademicsActionTypes.AcademicsRootInitialized;

    constructor(public payload: {semesters: Semester[]}) {}
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

    constructor(public payload: {draft: Application}) {}
}

export type AcademicsActionsUnion = 
    SubmitApplication
    | SaveDraftApplication
    | InitializeApplication
    | ApplicationInitialized
    | InitializeAcademicsRoot
    | AcademicsRootInitialized;