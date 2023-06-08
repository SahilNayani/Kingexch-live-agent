import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent, HttpHeaders,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { LoginService } from '../services/login.service'
import { CookieService } from 'ngx-cookie-service';
import { Router } from "@angular/router";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(private toastr: ToastrService, private loginService: LoginService,
    private cookie: CookieService, private router: Router) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(catchError((err: HttpErrorResponse) => {
      // if (err instanceof HttpErrorResponse) {
      //   if (err.status === 401 || err.status === 0) {
      //     console.log("err", err);
      //     if (err.error.message == "Invalid token: access token has expired") {

      //       this.toastr.error(err.error.message, '', {
      //         timeOut: 10000,
      //       });

      //       this.loginService.adminlogout().subscribe(result => {
      //         if (result.status == true) {
      //           this.cookie.delete('userId');
      //           // this.cookie.delete('accessToken');
      //           // this.cookie.delete('refreshToken');
      //           this.cookie.delete('is_socket');
      //           this.cookie.delete('transaction-password');
      //           this.cookie.delete('transaction_password_timeout')
      //           localStorage.removeItem("adminDetails");
      //           //this.loginService.clearLocalStorage()
      //           this.loginService.clearLocalStorage()
      //           this.router.navigate(['login'])
      //           window.location.replace('login');
      //         } else {
      //           this.toastr.error(result.msg, '', {
      //             timeOut: 10000,
      //           });
      //           this.router.navigate(['login'])
      //           window.location.replace('login');
      //         }
      //       })
      //       this.router.navigate(['login'])
      //       window.location.replace('login');
      //       //   this.loginService.refreshToken().subscribe((data) => { 
      //       //     this.cookie.set( 'accessToken', data.token.accessToken );
      //       //     this.cookie.set( 'refreshToken', data.token.refreshToken );

      //       //     const headers = new HttpHeaders({
      //       //       'Authorization': 'Bearer ' + data.token.accessToken,
      //       //       'Content-Type': 'application/json'
      //       //     });


      //       //     const cloneReq = request.clone({headers});

      //       //     return next.handle(cloneReq);

      //       //   }
      //       // );

      //     }
      //     else {
      //       this.toastr.error(err.error.message, '', {
      //         timeOut: 10000,
      //       });
      //       this.router.navigate(['login'])
      //       window.location.replace('login');
      //     }

      //   }

      // }
      const error = err.error.message
      return throwError(error);
    }))
  }



}
