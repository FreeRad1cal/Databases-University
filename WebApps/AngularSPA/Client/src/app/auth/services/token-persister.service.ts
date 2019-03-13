import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TokenPersisterService {

  private readonly key = 'auth_token';
  
  constructor() { }

  persistToken(token: string) {
    localStorage.setItem(this.key, token);
  }

  getToken() {
    return localStorage.getItem(this.key);
  }

  clearToken() {
    localStorage.removeItem(this.key);
  }
}
