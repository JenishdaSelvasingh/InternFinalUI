import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public isAuthenticated = false;

  constructor() { }

  login(role: string) {
    this.isAuthenticated = true;
  }

  logout() {
    this.isAuthenticated = false;
  }


  isAuthenticatedUser() {
    return this.isAuthenticated;
  }

}
