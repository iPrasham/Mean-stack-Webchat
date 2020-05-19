import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from '../api.service';
import { HelperService } from '../helper.service';

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

  constructor(private api: ApiService, private helper: HelperService, private router: Router) { }

  ngOnInit() {
  }

}
