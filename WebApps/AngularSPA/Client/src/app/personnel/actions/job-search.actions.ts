import { Action } from '@ngrx/store';
import { JobTitle } from '../models/JobTitle';
import { JobPosting } from '../models/JobPosting';
import { Pagination } from '../models/Pagination';

export enum PersonnelJobSearchActionTypes {
    SetPagination = "[PersonnelJobSearch] SetPagination",
    Search = "[PersonnelJobSearch] Search",
    SearchCompleted = "[PersonnelJobSearch] SeachCompleted",
    SearchFailed = "[PersonnelJobSearch] SearchFailed",
    ResetJobSearch = "[PersonnelJobSearch] ResetJobSearch",
    LoadJobPostingById = "[PersonnelJobSearch] LoadJobPostingById"
}

export class SetPagination implements Action {
    readonly type = PersonnelJobSearchActionTypes.SetPagination;
    
    constructor(public payload: {pagination: Pagination}) {}
}

export class Search implements Action {
    readonly type = PersonnelJobSearchActionTypes.Search;
    
    constructor(public payload: {query: string, jobTitles: JobTitle[]}) {}
}

export class SearchCompleted implements Action {
    readonly type = PersonnelJobSearchActionTypes.SearchCompleted;
    
    constructor(public payload: {postings: JobPosting[], totalPostings?: number}) {}
}

export class SearchFailed implements Action {
    readonly type = PersonnelJobSearchActionTypes.SearchFailed;
    
    constructor(public payload: {errors: string[]}) {}
}

export class ResetJobSearch implements Action {
    readonly type = PersonnelJobSearchActionTypes.ResetJobSearch;
}

export class LoadJobPostingById implements Action {
    readonly type = PersonnelJobSearchActionTypes.LoadJobPostingById;

    constructor(public payload: {id: string}) {}
}

export type PersonnelJobSearchActionsUnion = 
    SetPagination
    | Search
    | SearchCompleted
    | SearchFailed
    | ResetJobSearch
    | LoadJobPostingById;