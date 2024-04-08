import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IProfile } from './mock-backend.interceptor';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  base_url = 'http://api-url.com';

  userProfile?: IProfile;

  constructor(private http: HttpClient) { }

  isAuthenticated() {
    return !!localStorage.getItem('token');
  }

  login(loginData: any) {
    return this.http.post(`${this.base_url}/login`, loginData);
  }

  logout() {
    localStorage.removeItem('token');
  }

  getUserProfile() {
    this.http.get(`${this.base_url}/profile`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    }).subscribe((profile: any) => {
      this.userProfile = profile;
    });
  }

}
