import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { JobTitle } from '../models/JobTitle';
import { of } from 'rxjs';

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
}