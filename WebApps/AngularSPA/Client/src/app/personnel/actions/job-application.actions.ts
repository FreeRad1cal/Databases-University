import { Action } from '@ngrx/store';
import { JobTitle } from '../models/JobTitle';
import { JobPosting } from '../models/JobPosting';
import { Pagination } from '../models/Pagination';
import { JobApplication } from '../models/JobApplication';

export enum PersonnelApplicationActionTypes {
    SubmitJobApplication = "[PersonnelJobApplication] SubmitJobApplication",
    ApplicationSubmissionSuccess = "[PersonnelJobApplication] ApplicationSubmissionSuccess",
    ApplicationSubmissionFailure = "[PersonnelJobApplication] ApplicationSubmissionFailure",
    ResetJobApplication = "[PersonnelJobApplication] ResetJobApplication",
    LoadMyJobApplications = "[PersonnelJobApplication] LoadMyJobApplications",
    JobApplicationsLoaded = "[PersonnelJobApplication] JobApplicationsLoaded",
    OpenResume = "[PersonnelJobApplication] OpenApplication",
}

export class SubmitJobApplication implements Action {
    readonly type = PersonnelApplicationActionTypes.SubmitJobApplication;

    constructor(public payload: {application: JobApplication}) {}
}

export class ApplicationSubmissionSuccess implements Action {
    readonly type = PersonnelApplicationActionTypes.ApplicationSubmissionSuccess;

    constructor(public payload: {referenceNumber: string}) {}
}

export class ApplicationSubmissionFailure implements Action {
    readonly type = PersonnelApplicationActionTypes.ApplicationSubmissionFailure;

    constructor(public payload: {errors: string[]}) {}
}

export class ResetJobApplication implements Action {
    readonly type = PersonnelApplicationActionTypes.ResetJobApplication;
}

export class LoadMyJobApplications implements Action {
    readonly type = PersonnelApplicationActionTypes.LoadMyJobApplications;
}

export class JobApplicationsLoaded implements Action {
    readonly type = PersonnelApplicationActionTypes.JobApplicationsLoaded;
    
    constructor(public payload: {jobApplications: JobApplication[], totalJobApplications: number}) {}
}

export class OpenResume implements Action {
    readonly type = PersonnelApplicationActionTypes.OpenResume;

    constructor(public payload: {id: string}) {}
}

export type PersonnelApplicationActionsUnion = 
    SubmitJobApplication
    | ApplicationSubmissionSuccess
    | ApplicationSubmissionFailure
    | ResetJobApplication
    | LoadMyJobApplications
    | JobApplicationsLoaded
    | OpenResume;