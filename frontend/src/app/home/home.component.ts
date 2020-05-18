import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  public loginPassword: String;
  public loginEmail: String;
  public signupPassword: String;
  public confirmPassword: String;
  public signupEmail: String;
  public firstname: String;
  public lastname: String;
  public showloader: boolean = false;
  public registeredEmail: String;

  constructor() { }

  ngOnInit() {
  }

}
