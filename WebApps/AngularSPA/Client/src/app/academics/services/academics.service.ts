import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Semester } from '../models/Semester';

@Injectable({
    providedIn: 'root'
})
export class AcademicsService {
    private registrarApi = environment.registrarApi;

    constructor(private httpClient: HttpClient) {}

    getSemesters() {
        const semestersUrl = `${this.registrarApi}/semesters`;
        return this.httpClient.get<Semester[]>(semestersUrl, {observe: 'response'});
    }
}