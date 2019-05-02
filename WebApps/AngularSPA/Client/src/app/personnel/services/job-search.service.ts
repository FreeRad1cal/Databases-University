import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { JobTitle, jobTitleListSchema } from '../models/JobTitle';
import { throwError } from 'rxjs';
import { Pagination } from '../models/Pagination';
import { jobApplicationSchema } from '../models/JobApplication';
import { ArrayResult } from '../models/ArrayResult';
import { JobPosting, jobPostingSchema, jobPostingListSchema } from '../models/JobPosting';
import { map, catchError } from 'rxjs/operators';
import { normalize } from 'normalizr';

@Injectable({
    providedIn: 'root'
})
export class JobSearchService {
    private personnelApi = environment.personnelApi;

    constructor(private httpClient: HttpClient) {}

    getJobTitles() {
        const url = `${this.personnelApi}/employment/job-titles`;
        return this.httpClient.get<ArrayResult<any>>(url, {observe: 'response'}).pipe(
            map(res => {
                let jobTitles: JobTitle[] = [];
                if (res.body.items.length > 0) {
                    const normalized = normalize(res.body.items, jobTitleListSchema);
                    jobTitles = Object.values(normalized.entities.jobTitles);
                }
                return {
                    ...res.body,
                    items: {
                        jobTitles: jobTitles
                    }
                }
            }),
            catchError(res => throwError(this.resolveErrors(res)))
        );
    }

    getJobPostings(query: string, pagination: Pagination, jobTitles: string[]) {
        const url = `${this.personnelApi}/employment/job-postings`;
        return this.httpClient.get<ArrayResult<any>>(url, {observe: 'response', params: {
            query: query.trim(),
            limit: pagination.limit.toString(),
            offset: pagination.offset.toString(),
            jobTitles: jobTitles
        }}).pipe(
            map(res => {
                let jobPostings: JobPosting[] = [];
                if (res.body.items.length > 0) {
                    const normalized = normalize(res.body.items, jobPostingListSchema);
                    jobPostings = Object.values(normalized.entities.jobPostings);
                }
                return {
                    ...res.body,
                    items: {
                        jobPostings: jobPostings
                    }
                }
            }),
            catchError(res => throwError(this.resolveErrors(res)))
        );
    }

    getJobPostingById(id: string) {
        const url = `${this.personnelApi}/employment/job-postings/${id}`;
        return this.httpClient.get<any>(url, {observe: 'response'}).pipe(
            map(res =>  normalize([res.body], jobPostingSchema)),
            catchError(res => throwError(this.resolveErrors(res)))
        );;
    }

    private resolveErrors(res: HttpErrorResponse) {
        return res.error && res.error.errors ? res.error.errors : ["An error has occured"];
    }
}