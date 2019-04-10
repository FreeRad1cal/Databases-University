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
        const jobTitlesUrl = `${this.personnelApi}/employment/job-titles`;
        return this.httpClient.get<JobTitle[]>(jobTitlesUrl, {observe: 'response'});
    }

    getJobPostings(query: string, pagination: Pagination, titles: JobTitle[]) {
        const jobPostingsUrl = `${this.personnelApi}/employment/job-postings`;
        return this.httpClient.get<any>(jobPostingsUrl, {observe: 'response', params: {
            query: query.trim(),
            limit: pagination.limit.toString(),
            offset: pagination.offset.toString(),
            jobTitles: titles.map(title => title.name)
        }});
    }

    getJobPostingById(id: string) {
        const jobPostingsByIdUrl = `${this.personnelApi}/employment/job-postings/${id}`;
        return this.httpClient.get<JobPosting>(jobPostingsByIdUrl, {observe: 'response'});
    }

    submitJobApplication(application: JobApplication) {
        const jobApplicationsUrl = `${this.personnelApi}/employment/job-applications`;
        const formData = new FormData();
        formData.append('jobPostingId', application.jobPostingId);
        formData.append('resume', application.resume);
        return this.httpClient.post<any>(jobApplicationsUrl, formData, {observe: 'response'});
    }

    getJobApplications(params: {applicantId?: string, jobPostingId?: string}) {
        const jobApplicationsUrl = `${this.personnelApi}/employment/job-applications`;
        return this.httpClient.get<ArrayResult<JobApplication>>(jobApplicationsUrl, {observe: 'response', params: params});
    }

    getResumeByApplicationId(id: string) {
        const resumesUrl = `${this.personnelApi}/employment/resumes/${id}`;
        return this.httpClient.get(resumesUrl, {responseType: 'blob'})
    }
}