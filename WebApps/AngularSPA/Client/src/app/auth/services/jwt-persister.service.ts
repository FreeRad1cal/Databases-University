import { Injectable } from '@angular/core';
import { Person } from '../models/Person';

@Injectable({
  providedIn: 'root'
})
export class JwtPersisterService {

  private readonly key = 'auth_token';
  
  constructor() { }

  persistToken(token: string) {
    localStorage.setItem(this.key, token);
  }

  getPersistedToken() {
    return localStorage.getItem(this.key);
  }

  clearPersistedToken() {
    localStorage.removeItem(this.key);
  }
}
