import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private base_url = 'http://api-url.com';

  constructor(private http: HttpClient) { }

  get(endpoint: string, params?: any) {
    return this.http.get(this.base_url+endpoint, {
      params,
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
  }

  post(endpoint: string, body: any) {
    return this.http.post(this.base_url+endpoint, body, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
  }

  put(endpoint: string, body: any) {
    return this.http.put(this.base_url+endpoint, body, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
  }

  delete(endpoint: string) {
    return this.http.delete(this.base_url+endpoint, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
  }

  patch(endpoint: string, body: any) {
    return this.http.patch(this.base_url+endpoint, body, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
  }
}
