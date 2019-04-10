import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { JobTitle } from '../models/JobTitle';
import { of } from 'rxjs';
import { Pagination } from '../models/Pagination';
import { JobApplication } from '../models/JobApplication';
import { ArrayResult } from '../models/ArrayResult';
import { JobPosting } from '../models/JobPosting';

@Injectable({
    providedIn: 'root'
})
export class PersonnelService {
    private personnelApi = environment.personnelApi;

    constructor(private httpClient: HttpClient) {}

    getJobTitles() {
        const url = `${this.personnelApi}/employment/job-titles`;
        return this.httpClient.get<JobTitle[]>(url, {observe: 'response'});
    }

    getJobPostings(query: string, pagination: Pagination, titles: JobTitle[]) {
        const url = `${this.personnelApi}/employment/job-postings`;
        return this.httpClient.get<any>(url, {observe: 'response', params: {
            query: query.trim(),
            limit: pagination.limit.toString(),
            offset: pagination.offset.toString(),
            jobTitles: titles.map(title => title.name)
        }});
    }

    getJobPostingById(id: string) {
        const url = `${this.personnelApi}/employment/job-postings/${id}`;
        return this.httpClient.get<JobPosting>(url, {observe: 'response'});
    }

    submitJobApplication(application: JobApplication) {
        const url = `${this.personnelApi}/employment/job-applications`;
        const formData = new FormData();
        formData.append('jobPostingId', application.jobPostingId);
        formData.append('resume', application.resume);
        return this.httpClient.post<any>(url, formData, {observe: 'response'});
    }

    getJobApplications(params: {applicantId?: string, jobPostingId?: string}) {
        const url = `${this.personnelApi}/employment/job-applications`;
        return this.httpClient.get<ArrayResult<JobApplication>>(url, {observe: 'response', params: params});
    }

    getResumeByApplicationId(id: string) {
        const url = `${this.personnelApi}/employment/resumes/${id}`;
        return this.httpClient.get(url, {responseType: 'blob'})
    }

    deleteJobApplicationById(id: string) {
        const url = `${this.personnelApi}/employment/job-applications/${id}`;
        return this.httpClient.delete(url, {observe: 'response'});
    }
}