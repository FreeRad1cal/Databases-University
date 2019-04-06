import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Application } from '../models/Application';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class ApplicationService {
    private registrarApi = environment.registrarApi;

    constructor(private httpClient: HttpClient) {}

    getApplicationDraft() {
        const applicationsUrl = `${this.registrarApi}/applications`;
        return this.httpClient.get<Application>(applicationsUrl, {observe: 'response'});
    }
}