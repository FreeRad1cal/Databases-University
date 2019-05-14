import { Action } from '@ngrx/store';
import { JobTitle } from '../models/JobTitle';
import { JobPosting } from '../models/JobPosting';
import { JobSearchQuery } from '../models/JobSearchQuery';

export enum PersonnelJobSearchActionTypes {
    Search = "[PersonnelJobSearch] Search",
    SearchFailed = "[PersonnelJobSearch] SearchFailed",
    Reset = "[PersonnelJobSearch] Reset"
}

export class Search implements Action {
    readonly type = PersonnelJobSearchActionTypes.Search;
    
    constructor(public payload: {query: JobSearchQuery}) {}
}

export class SearchFailed implements Action {
    readonly type = PersonnelJobSearchActionTypes.SearchFailed;
    
    constructor(public payload: {errors: string[]}) {}
}

export class Reset implements Action {
    readonly type = PersonnelJobSearchActionTypes.Reset;
}

export type PersonnelJobSearchActionsUnion = 
    | Search
    | SearchFailed
    | Reset;