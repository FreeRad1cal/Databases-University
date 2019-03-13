import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { JwtPersisterService } from './jwt-persister.service';
import { Observable } from 'rxjs';
import { Person } from '../models/Person';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';
import * as jwt_decode from "jwt-decode";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authApi = environment.authApi;
  private hrApi = environment.personnelApi;

  constructor(
    private jwtPersister: JwtPersisterService,
    private httpClient: HttpClient) { }

  getToken(userName: string, password: string): Observable<HttpResponse<string>> {
    const tokenUrl = `${this.authApi}/token`;
    return this.httpClient.post<string>(tokenUrl, {userName, password}, { observe: 'response'});
  }

  getMe(): Observable<HttpResponse<Person>> {
    const meUrl = `${this.hrApi}/people/me`;
    return this.httpClient.get<Person>(meUrl, { observe: 'response'});
  }

  validateJwt(jwt: string): boolean {
    try {
      return jwt != null && jwt_decode<{exp: number}>(jwt).exp < new Date().getTime();
    }
    catch {
      return false;
    }
  }

  getExpiration(jwt: string): Date {
    const utcMsExp = jwt_decode<{exp: number}>(jwt).exp;
    const expires = new Date(0);
    expires.setUTCMilliseconds(utcMsExp);
    return expires;
  }
}
