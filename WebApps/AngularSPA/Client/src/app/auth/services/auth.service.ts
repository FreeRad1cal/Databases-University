import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { JwtPersisterService } from './jwt-persister.service';
import { Observable } from 'rxjs';
import { Person } from '../models/Person';
import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { LoginCredentials } from '../models/LoginCredentials';
import { AuthErrorResponseInterceptorService } from './auth-error-response-interceptor.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authApi = environment.authApi;
  private personnelApi = environment.personnelApi;

  constructor(
    private httpClient: HttpClient) { }

  authenticate(credentials: LoginCredentials): Observable<HttpResponse<string>> {
    const tokenUrl = `${this.authApi}/authenticate`;
    const headers = new HttpHeaders().set(AuthErrorResponseInterceptorService.InterceptorSkipHeader, '');
    return this.httpClient.post<string>(tokenUrl, credentials, { observe: 'response', headers: headers});
  }

  getMe(): Observable<HttpResponse<Person>> {
    const meUrl = `${this.personnelApi}/people/me`;
    const headers = new HttpHeaders().set(AuthErrorResponseInterceptorService.InterceptorSkipHeader, '');
    return this.httpClient.get<Person>(meUrl, { observe: 'response', headers: headers});
  }
}
