import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { throwError, Observable } from 'rxjs';
import { jobApplicationSchema, JobApplication, jobApplicationListSchema } from '../models/JobApplication';
import { ArrayResult } from '../models/ArrayResult';
import { map, catchError } from 'rxjs/operators';
import { normalize } from 'normalizr';
import { JobPosting } from '../models/JobPosting';

@Injectable({
    providedIn: 'root'
})
export class JobApplicationService {
    private personnelApi = environment.personnelApi;

    constructor(private httpClient: HttpClient) {}

    submitJobApplication(jobPostingId: string, resume: File) {
        const url = `${this.personnelApi}/employment/job-applications`;
        const formData = new FormData();
        formData.append('jobPostingId', jobPostingId);
        formData.append('resume', resume);
        return this.httpClient.post<any>(url, formData, {observe: 'response'}).pipe(
            map(res => {
              const normalized = normalize(res.body, jobApplicationSchema);
              return {
                jobApplication: Object.values(normalized.entities.jobApplications)[0] as JobApplication,
                jobPosting: Object.values(normalized.entities.jobPostings)[0] as JobPosting
              };
            }),
            catchError(res => throwError(this.resolveErrors(res)))
        );
    }

    getJobApplications(params: {applicantId?: string, jobPostingId?: string}) {
        const url = `${this.personnelApi}/employment/job-applications`;
        return this.httpClient.get<ArrayResult<any>>(url, {observe: 'response', params: params}).pipe(
          map(res => {
            let jobApplications: JobApplication[] = [];
            let jobPostings: JobPosting[] = [];
            if (res.body.items.length > 0) {
                const normalized = normalize(res.body.items, jobApplicationListSchema);
                jobApplications = Object.values(normalized.entities.jobApplications);
                jobPostings = Object.values(normalized.entities.jobPostings);
            }
            return {
                ...res.body,
                items: {
                    jobApplications: jobApplications,
                    jobPostings: jobPostings
                }
            }
          }),
          catchError(res => throwError(this.resolveErrors(res)))
        );
    }

    getResumeByApplicationId(id: string) {
        const url = `${this.personnelApi}/employment/resumes/${id}`;
        return this.httpClient.get(url, {responseType: 'blob'}).pipe(
            catchError(res => throwError(this.resolveErrors(res)))
        )
    }

    deleteJobApplicationById(id: string) {
        const url = `${this.personnelApi}/employment/job-applications/${id}`;
        return this.httpClient.delete(url, {observe: 'response'}).pipe(
            catchError(res => throwError(this.resolveErrors(res)))
        );
    }

    private resolveErrors(res: HttpErrorResponse) {
        return res.error && res.error.errors ? res.error.errors : ["An error has occured"];
    }
}