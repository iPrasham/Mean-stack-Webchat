import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { HelperService } from '../helper.service';
import { ToastrService } from 'ngx-toastr';

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

  public lastTimestamp: Number = 0;
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

  constructor() { }

  ngOnInit() {
  }

}
