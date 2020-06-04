import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { from } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HelperService {

  constructor(private router: Router, private toastr: ToastrService) { }

  verifyUserLogin() {
    if (!localStorage.getItem('authToken')) {
      this.logout(false);
      this.toastr.info('Redirecting to home', 'Invalid or Expired session');
    }
  }

  logout(showMessage: Boolean = true) {
    localStorage.clear();
    this.router.navigate(['/home']);
    if (showMessage) {
      this.toastr.success('User successfully logged out', "Success");
    }
  }
}
