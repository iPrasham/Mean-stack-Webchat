import { Injectable } from '@angular/core';
import { Http, HttpModule } from '@angular/http';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  // default request url
  private userUrl = 'api/v1/user';
  private roomUrl = 'api/v1/room';
  private authToken = localStorage.getItem('authToken');

  constructor(private http: HttpClient) { }

  // user related apis
  login(email: String, password: String) {
    return this.http.post(this.userUrl + '/login', { email: email, password: password });
  }

  signup(email: String, password: String, firstname: String, lastname?: String) {
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

  forgotPassword(email: String) {
    return this.http.post(this.userUrl + '/forgot-password', { email: email });
  }

  resetPassword(authToken: String, newPassword: String) {
    return this.http.post(this.userUrl + '/update-password', { authToken: authToken, password: newPassword });
  }

  // room related apis
  createRoom(name: String) {
    return this.http.post(this.roomUrl + '/create', { authToken: this.authToken, name: name });
  }

  listChat(roomId: String) {
    return this.http.post(this.roomUrl + '/chatList', { authToken: this.authToken, roomId: roomId });
  }

  listRooms() {
    return this.http.post(this.roomUrl + '/list', { authToken: this.authToken });
  }

  renameRoom(name: String, roomId: String) {
    return this.http.post(this.roomUrl + '/update', { authToken: this.authToken, roomId: roomId });
  }

  deactivateRoom(roomId: String) {
    return this.http.post(this.roomUrl + '/deactivate', { authToken: this.authToken, roomId: roomId });
  }

  activateRoom(roomId: String) {
    return this.http.post(this.roomUrl + '/activate', { authToken: this.authToken, roomId: roomId });
  }

  deleteRoom(roomId: String) {
    return this.http.post(this.roomUrl + '/delete', { authToken: this.authToken, roomId: roomId });
  }

}
