import { Action } from '@ngrx/store';
import { JobTitle } from '../models/JobTitle';
import { JobPosting } from '../models/JobPosting';
import { JobApplication } from '../models/JobApplication';

export enum PersonnelActionTypes {
    AddJobTitles = '[Personnel] AddJobTitles',
    AddJobPostings = '[Personnel] AddJobPostings',
    AddJobApplications = '[Personnel] AddJobApplications',
    LoadJobTitles = '[Personnel] LoadJobTitles'
}

export class AddJobTitles implements Action {
    readonly type = PersonnelActionTypes.AddJobTitles;

    constructor(public payload: {jobTitles: JobTitle[], total?: number}) {}
}

export class AddJobPostings implements Action {
    readonly type = PersonnelActionTypes.AddJobPostings;

    constructor(public payload: {jobPostings: JobPosting[], total?: number}) {}
}

export class AddJobApplications implements Action {
    readonly type = PersonnelActionTypes.AddJobApplications;

    constructor(public payload: {jobApplications: JobApplication[], total?: number}) {}
}

export class LoadJobTitles implements Action {
    readonly type = PersonnelActionTypes.LoadJobTitles;
}

export type PersonnelActionsUnion = 
    AddJobTitles
    | AddJobPostings
    | AddJobApplications
    | LoadJobTitles;