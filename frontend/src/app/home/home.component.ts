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

  constructor(private api: ApiService, private helper: HelperService, private router: Router, private toastr: ToastrService) { }

  ngOnInit() {
  }

  login() {
    this.showloader = true;
    this.api.login(this.loginEmail, this.loginPassword).subscribe((res: any) => {
      this.showloader = false;
      if (res.error) {
        this.toastr.error(res.message, 'Failed');
      } else {
        localStorage.setItem('authToken', res.data.authToken);
        localStorage.setItem('firstname', res.data.firstname);
        localStorage.setItem('userId', res.data.userId);
        if (res.data.lastname) {
          localStorage.setItem('lastname', res.data.lastname);
        }
        this.toastr.success(res.message, 'Success');
        this.router.navigate(['/chat']);
      }
    });
  }

  signup() {
    if (!(this.confirmPassword == this.signupPassword)) {
      this.toastr.error('Password mismatch', 'Error');
    } else {
      this.showloader = true;
      this.api.signup(this.signupEmail, this.signupPassword, this.firstname, this.lastname).subscribe((res: any) => {
        this.showloader = false;
        if (res.error) {
          this.toastr.error(res.message, 'Failed');
        } else {
          this.toastr.success(res.message, 'Success');
          this.loginEmail = this.signupEmail;
          this.loginPassword = this.signupPassword;
          this.login();
        }
      });
    }
  }

  resetPassword() {
    this.showloader = true;
    this.api.forgotPassword(this.registeredEmail).subscribe((res: any) => {
      this.showloader = false;
      if (res.error) {
        this.toastr.error(res.message, 'Error');
      } else {
        this.toastr.success(res.message, 'Success');
      }
    });
  }
}
