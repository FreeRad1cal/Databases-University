import { Action } from '@ngrx/store';
import { JobTitle } from '../models/JobTitle';

export enum PersonnelActionTypes {
    LoadJobTitles = '[Personnel] LoadJobTitles',
    JobTitlesLoaded = '[Personnel] JobTitlesLoaded'
}

export class LoadJobTitles implements Action {
    readonly type = PersonnelActionTypes.LoadJobTitles;
}

export class JobTitlesLoaded implements Action {
    readonly type = PersonnelActionTypes.JobTitlesLoaded;

    constructor(public payload: {jobTitles: JobTitle[]}) {}
}


export type PersonnelActionsUnion = 
    LoadJobTitles
    | JobTitlesLoaded;