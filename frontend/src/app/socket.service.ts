import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class SocketService {

  public socket;
  private authToken;

  constructor() { }

  startConnection() {
    this.authToken = localStorage.getItem('authToken');
    this.socket = io('http://localhost:3000/api/v1/chat');

    return new Observable((obs) => {
      this.socket.on('verifyUser', () => {
        obs.next();
      });
    });
  }
}
