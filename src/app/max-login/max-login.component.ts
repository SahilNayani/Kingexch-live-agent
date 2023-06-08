import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginService } from '../services/login.service'
import { ToastrService } from 'ngx-toastr';
import { CookieService } from 'ngx-cookie-service';
//import { UsersService } from '../services/users.service';
import Swal from 'sweetalert2'
@Component({
  selector: 'app-max-login',
  templateUrl: './max-login.component.html',
  styleUrls: ['./max-login.component.scss']
})
export class MaxLoginComponent implements OnInit {

  Form: FormGroup;
  loginButtonDisable = false
  submitted = false;
  transactionPassword: string;
  showResponseMessage;
  private clickTimeout = null;
  userData: string;
  name: any;
  dummyLength: string;
  public showPassword: boolean;
  a: any;
  logo: string;
  constructor(private router: Router,
    private fb: FormBuilder, // private usersService: UsersService,
    private loginService: LoginService, private cookie: CookieService,
    private toastr: ToastrService) { }

  ngOnInit(): void {
    this.logo =window.location.hostname;
    this.createFrom();
    // this.createRandomTransactionPassword();
    this.clearCookieAndLocalStorage();
  }

  createFrom() {
    this.Form = this.fb.group({
      user_name: ['', Validators.required],
      password: ['', [Validators.required]],
      grant_type: ['password']
    })
  }




  get f() { return this.Form.controls; }

  async onSubmitLogin() {
    this.loginButtonDisable = true
    if (this.clickTimeout) {
      this.setClickTimeout(() => { });
    } else {
      // if timeout doesn't exist, we know it's first click 
      // treat as single click until further notice
      this.setClickTimeout(() =>
        this.handleSingleLoginClick());
    }
  }
  public handleSingleLoginClick() {
    //The actual action that should be performed on click      
    this.submitted = true;
    this.a = (this.Form.value.user_name);
    let b = (this.a).toLowerCase()
    this.Form.value.user_name = b;
    if (this.Form.invalid) {
      this.loginButtonDisable = false
      return;
    }
    this.loginService.submitlogin(this.Form.value).subscribe((result) => {
      if (result.status == true) {
        var accres = this.setCokkies(result)
        localStorage.setItem('adminDetails', JSON.stringify(result.data));

        //  this.cookie.set( 'accessToken', result.token.accessToken );

        //      this.cookie.set( 'userId', result.data._id );

        //      this.cookie.set( 'refreshToken', result.token.refreshToken );
        this.toastr.success(result.msg, '', {
          positionClass: 'toast-bottom-right',
          timeOut: 1000
        });
        this.loginButtonDisable = false
        // if (result.data.transaction_password == null || result.data.transaction_password == undefined || result.data.transaction_password == '') {
        //   this.rand(4)
        //   this.createRandomTransactionPassword();
        //   this.updateTransactionPassword(result.data._id);
        // }

        // else {
          this.redirectToDashboard();
        //   // this.router.navigate(['dashboard'])

        // }
      } else {
        this.showResponseMessage = result.msg;
        // this.toastr.error(result.msg,'',{
        //   timeOut: 10000,
        // });
        this.loginButtonDisable = false
      }
    }, (err) => {
      console.log(err);
      this.loginButtonDisable = false
    });
  }

  async redirectToDashboard() {
    var acctoken = localStorage.getItem('adminAccessToken');
    if (acctoken != null && acctoken != undefined && acctoken != '') {
      this.router.navigate(['dashboard'])
    }
  }

  async setCokkies(result) {
    localStorage.setItem('adminAccessToken', result.token.accessToken)
    localStorage.setItem('userId', result.data._id)
    localStorage.setItem('adminRefreshToken', result.token.refreshToken)
    var acctoken = localStorage.getItem('adminAccessToken');

    this.router.navigate(['dashboard'])

  }
  // rand(len) {
  //   var x = '';
  //   for (var i = 0; i < len; i++) {
  //     x += Math.floor(Math.random() * 10);

  //   }
  //   this.dummyLength = x;
  //   // this.manualMarketId = '1.'+ x/;

  // }
  // createRandomTransactionPassword() {
  //   //initialize a variable having alpha-numeric characters
  //   // var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";

  //   // //specify the length for the new string to be generated
  //   // var string_length = 8;
  //   var randomstring = '';

  //   // //put a loop to select a character randomly in each iteration
  //   // for (var i = 0; i < string_length; i++) {
  //   //   var rnum = Math.floor(Math.random() * chars.length);
  //   //   randomstring += chars.substring(rnum, rnum + 1);
  //   // }
  //   this.userData = JSON.parse(localStorage.getItem('adminDetails'));
  //   this.name = this.userData['user_name'];
  //   var dummyName = (this.name).substring(0, 3)
  //   randomstring = dummyName + '*' + this.dummyLength;
  //   this.transactionPassword = randomstring;

  // }

  // updateTransactionPassword(userid) {
  //   var obj: any = {};
  //   obj.transaction_password = this.transactionPassword;
  //   this.loginService.updateTransactionPassword(userid, obj).subscribe((result) => {
  //     if (result.status == true) {
  //       this.router.navigate(['dashboard'])
  //       this.toastr.success(result.msg, '', {
  //         positionClass: 'toast-bottom-right',
  //         timeOut: 1000
  //       });

  //       Swal.fire({
  //         title: 'Please remember or take picture of code for Deposit or Withdrawl balance',
  //         text: this.transactionPassword,
  //         icon: 'success',
  //         // showCancelButton: true,
  //         confirmButtonText: 'Okay',
  //         // cancelButtonText: 'Cancel'
  //       }).then((result) => {
  //         if (result.isConfirmed) {


  //           this.router.navigate(['dashboard'])

  //         } else if (result.dismiss === Swal.DismissReason.cancel) {
  //           this.router.navigate(['dashboard'])
  //         }
  //       })

  //     } else {



  //       this.toastr.error(result.msg, '', {
  //         timeOut: 10000,
  //       });
  //       this.router.navigate(['dashboard'])
  //     }


  //   }, (err) => {
  //     console.log(err);
  //   });
  // }


  // sets the click timeout and takes a callback 
  // for what operations you want to complete when
  // the click timeout completes
  public setClickTimeout(callback) {
    // clear any existing timeout
    clearTimeout(this.clickTimeout);
    this.clickTimeout = setTimeout(() => {
      this.clickTimeout = null;
      callback();
    }, 400);
  }


  clearCookieAndLocalStorage() {
    this.cookie.delete('userId');
    this.cookie.delete('is_socket');
    this.cookie.delete('transaction-password');
    this.cookie.delete('transaction_password_timeout')
    localStorage.removeItem("adminDetails");
    //this.loginService.clearLocalStorage()
    this.loginService.clearLocalStorage()
  }

}
