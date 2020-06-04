import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  // default request url
  private userUrl = 'api/v1/user';
  private roomUrl = 'api/v1/room';

  constructor(private http: HttpClient) { }

  // user related apis
  login (email: String, password: String) {
    return this.http.post(this.userUrl + '/login', { email: email, password: password });
  }

  signup (email: String, password: String, firstname: String, lastname?: String) {
    let body = {
      email: email,
      password: password,
      firstname: firstname,  
    };
    if (lastname && lastname.trim() != '') {
      body['lastname'] = lastname;
    }
    return this.http.post(this.userUrl + '/signup', body);
  }
  
}
