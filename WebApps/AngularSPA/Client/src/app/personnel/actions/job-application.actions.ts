import { Action } from '@ngrx/store';
import { JobTitle } from '../models/JobTitle';
import { JobPosting } from '../models/JobPosting';
import { Pagination } from '../models/Pagination';
import { JobApplication } from '../models/JobApplication';
import { JobApplicationActionDescriptor } from '../reducers/job-application.reducer';

export enum PersonnelApplicationActionTypes {
    SubmitJobApplication = "[PersonnelJobApplication] SubmitJobApplication",
    JobApplicationSubmissionSuccess = "[PersonnelJobApplication] JobApplicationSubmissionSuccess",
    JobApplicationSubmissionFailure = "[PersonnelJobApplication] JobApplicationSubmissionFailure",
    SubmitJobApplicationAction = "[PersonnelJobApplication] SubmitJobApplicationAction",
    JobApplicationActionSuccess = "[PersonnelJobApplication] JobApplicationActionSuccess",
    LoadMyJobApplications = '[PersonnelJobApplication] LoadMyJobApplications',
    OpenResume = '[PersonnelJobApplication] OpenResume'
}

export class SubmitJobApplication implements Action {
    readonly type = PersonnelApplicationActionTypes.SubmitJobApplication;

    constructor(public payload: {jobPostingId: string, resume: File}) {}
}

export class JobApplicationSubmissionSuccess implements Action {
    readonly type = PersonnelApplicationActionTypes.JobApplicationSubmissionSuccess;

    constructor(public payload: {jobApplication: JobApplication}) {}
}

export class JobApplicationSubmissionFailure implements Action {
    readonly type = PersonnelApplicationActionTypes.JobApplicationSubmissionFailure;

    constructor(public payload: {errors: string[]}) {}
}

export class SubmitJobApplicationAction implements Action {
    readonly type = PersonnelApplicationActionTypes.SubmitJobApplicationAction;

    constructor(public payload: {jobApplicationAction: JobApplicationActionDescriptor}) {}
}

export class JobApplicationActionSuccess implements Action {
    readonly type = PersonnelApplicationActionTypes.JobApplicationActionSuccess;

    constructor(public payload: {jobApplicationAction: JobApplicationActionDescriptor}) {}
}

export class LoadMyJobApplications implements Action {
    readonly type = PersonnelApplicationActionTypes.LoadMyJobApplications;
}

export class OpenResume implements Action {
    readonly type = PersonnelApplicationActionTypes.OpenResume;

    constructor(public payload: {id: string}) {}
}

export type PersonnelApplicationActionsUnion = 
    SubmitJobApplication
    | JobApplicationSubmissionSuccess
    | JobApplicationSubmissionFailure
    | SubmitJobApplicationAction
    | JobApplicationActionSuccess
    | LoadMyJobApplications
    | OpenResume;