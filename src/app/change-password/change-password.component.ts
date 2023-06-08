import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CookieService } from 'ngx-cookie-service';
import { UsersService } from '../services/users.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {

  changePasswordForm: FormGroup;
  submitted = false;
  user_id: any;
  constructor(private router: Router,
    private fb: FormBuilder,
    private usersService: UsersService, private cookie: CookieService,
    private toastr: ToastrService) { }

  ngOnInit(): void {
    this.user_id = localStorage.getItem('userId');

    this.createChangePasswordFrom();

  }

  createChangePasswordFrom() {
    this.changePasswordForm = this.fb.group({

      old_password: ['', [Validators.required]],
      new_password: ['', [Validators.required]],
      confirm_password: ['', [Validators.required]]

    })
  }



  get f() { return this.changePasswordForm.controls; }

  onSubmitChangePassword() {
    this.submitted = true;

    if (this.changePasswordForm.invalid) {
      return;
    }

    if (this.changePasswordForm.controls['new_password'].value == this.changePasswordForm.controls['confirm_password'].value) {

      this.usersService.changePassword(this.user_id, this.changePasswordForm.value).subscribe((result) => {
        if (result.status == true) {
          this.submitted = false;
          this.toastr.success(result.msg, '', {
            positionClass: 'toast-bottom-right',
            timeOut: 1000
          });
          this.router.navigate(['dashboard'])
        } else {
          this.toastr.error(result.msg, '', {
            timeOut: 10000,
          });
        }
      }, (err) => {
        console.log(err);
      });
    }

    else {
      this.toastr.error("Password and confirm password did not match", '', {
        timeOut: 10000,
      });
    }


  }

}
