import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { HelperService } from '../helper.service';
import { ToastrService } from 'ngx-toastr';
import * as $ from 'jquery';
import { ActivatedRoute } from '@angular/router';
import { SocketService } from '../socket.service';
import { timeStamp } from 'console';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  public groupList: Array<any>;
  public chatList: Array<any>;

  public currentRoom;   // room where user is currently in 

  public typingUser: String = '';
  public message: String = '';

  public listTimestamp: Number = 0;
  private userId: String;
  private username: String;

  // modal variables
  public forNew: Boolean = false;
  public roomId;  // used for edit and delete
  public roomName;
  public active: String;
  public saveButtonText: String;

  public prevName: String;
  public prevActive: String;

  constructor(private socket: SocketService, private api: ApiService, private helper: HelperService, private toastr: ToastrService, private route: ActivatedRoute) { }

  ngOnInit() {
    console.log('Chat Init');

    this.helper.verifyUserLogin();

    this.userId = localStorage.getItem('userId');
    let firstname = localStorage.getItem('firstname');
    let lastname = localStorage.getItem('lastname') ? localStorage.getItem('lastname') : '';
    this.username = firstname + lastname;

    this.username = this.username ? this.username.trim() : undefined;

    // if user is present
    this.getRoomList();
    this.connect();
    this.handlerError();
    this.listenForNewChat();
  }


  connect() {
    this.socket.startConnection().subscribe(() => {
      this.socket.setUser();
    });
  }

  getRoomList() {
    this.api.listRooms().subscribe((res: any) => {
      if (res.error) {
        this.toastr.error('Failed to load group list. Refresh page');
      } else if (!res.error && res.timestamp > this.listTimestamp) {
        this.groupList = res.data;
        this.listTimestamp = res.timestamp;
        this.joinRoomFromRoute();   // now that we have room list we can join a room if it is provided in path
      }
    });
  }

  joinRoomFromRoute() {
    let roomId = this.route.snapshot.queryParamMap.get('join');
    if (roomId) {
      this.joinRoom(roomId);
    }
  }

  joinRoom(roomId: String) {
    this.currentRoom = this.getRoom(roomId);
    if (!this.currentRoom) {
      this.toastr.error('No such room.');
    } else {
      this.socket.joinRoom(roomId);
      this.toastr.info(`Joining Room: ${this.currentRoom.name}`, "Room Joined");
      this.api.listChat(this.currentRoom.roomId).subscribe((res: any) => {
        this.chatList = res.data;
      });
    }
  }

  getRoom(roomId: String) {
    if (this.groupList) {
      for (let item of this.groupList) {
        if (item.roomId == roomId) {
          return item;
        }
      }
    }
    return null;
  }

  handlerError() {
    this.socket.authError().subscribe(() => {
      console.log('Auth error occured');
      this.toastr.info('Redirecting to home', 'Invalid/Expired session');
      this.helper.logout(false);
    });
  }

  listenForNewChat() {
    this.socket.newChat().subscribe((chatObj) => {
      this.chatList.push(chatObj);
      console.log(this.chatList);
    });
  }

}
