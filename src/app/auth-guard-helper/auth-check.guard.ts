import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { Router } from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class AuthCheckGuard implements CanActivate {
  accessToken;
  constructor(private cookie: CookieService, private router: Router) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    this.accessToken = localStorage.getItem('adminAccessToken');;
    if (this.accessToken) {
      return true;
    }
    else {
      this.router.navigate(['login'])
      window.location.replace('login');
      return false;
    }

  }

}
