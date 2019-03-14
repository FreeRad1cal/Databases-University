import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { JwtPersisterService } from './jwt-persister.service';
import { Observable } from 'rxjs';
import { Person } from '../models/Person';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authApi = environment.authApi;
  private hrApi = environment.personnelApi;

  constructor(
    private httpClient: HttpClient) { }

  authenticate(userName: string, password: string): Observable<HttpResponse<string>> {
    const tokenUrl = `${this.authApi}/authenticate`;
    return this.httpClient.post<string>(tokenUrl, {userName, password}, { observe: 'response'});
  }

  getMe(): Observable<HttpResponse<Person>> {
    const meUrl = `${this.hrApi}/people/me`;
    return this.httpClient.get<Person>(meUrl, { observe: 'response'});
  }
}
