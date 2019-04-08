import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { JobPosting } from '../models/JobPosting';
import { JobTitle } from '../models/JobTitle';
import { Pagination } from '../models/Pagination';

@Injectable({
    providedIn: 'root'
})
export class JobSearchService {
    private personnelApi = environment.personnelApi;

    constructor(private httpClient: HttpClient) {}

    getJobPostings(query: string, pagination: Pagination, titles: JobTitle[]) {
        const jobPostingsUrl = `${this.personnelApi}/employment/job-postings`;
        return this.httpClient.get<any>(jobPostingsUrl, {observe: 'response', params: {
            query: query.trim(),
            limit: pagination.limit.toString(),
            offset: pagination.offset.toString(),
            jobTitles: titles.map(title => title.name)
        }});
    }
}