import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpHeaderResponse, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { CookieService } from 'ngx-cookie-service';
//import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  public Base_Url = environment['adminServerUrl'];
  public token = (localStorage.getItem('adminAccessToken'));
  public adminRefreshToken = localStorage.getItem('adminRefreshToken');
  logInHeader = new HttpHeaders({
    'Content-Type': 'application/x-www-form-urlencoded',
    'Authorization': 'Basic YXBwbGljYXRpb246c2VjcmV0'
  });

  constructor(private http: HttpClient, private cookie: CookieService) { }




  // submitlogin(loginInfo) {
  //   return this.http.post<any>(this.Base_Url + 'user/adminLogin',loginInfo, { headers: this.logInHeader });
  // }

  submitlogin(loginInfo) {
    localStorage.removeItem('user_name');
    localStorage.removeItem('password');
    localStorage.removeItem('RememberMe');
    if(loginInfo.isRememberMe){
      localStorage.setItem('user_name', loginInfo.user_name);
      localStorage.setItem('password', loginInfo.password);
      localStorage.setItem('RememberMe', JSON.stringify(loginInfo.isRememberMe));
    }

    let body = new HttpParams()
      .set('user_name', loginInfo.user_name)
      .set('password', loginInfo.password)
      .set('grant_type', loginInfo.grant_type);

    return this.http.post<any>(this.Base_Url + 'user/adminLogin', body, { headers: this.logInHeader });
  }


  adminlogout(param) {
    this.token = (localStorage.getItem('adminAccessToken'));
    let reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ` + this.token
    });
    return this.http.post<any>(this.Base_Url + 'user/logout', param,{ headers: reqHeader });
  }
  // getLoginUseretails(id) {

  //   return this.http.get<any>(this.Base_Url + 'user/userdetails/'+id, { headers: this.reqHeader });
  // }
  getLogo(data){
    return this.http.post<any>(this.Base_Url + 'content/getLogo', data);
  }

  refreshToken() {

    let body = new HttpParams()
      .set('grant_type', 'refresh_token')
      .set('refresh_token', this.adminRefreshToken);

    return this.http.post<any>(this.Base_Url + 'oauth2/token', body, { headers: this.logInHeader });
    // .pipe(map(res => {
    //   return res;
    // }));
  }


  updateTransactionPassword(id, data) {
    this.token = localStorage.getItem('adminAccessToken')
    var transHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ` + this.token
    });

    return this.http.post<any>(this.Base_Url + 'user/updateTransactionPasswordOfUser/' + id, data, { headers: transHeader });
  }

  clearLocalStorage(){
    let exclude =["user_name", "password","RememberMe"]
    for (var i = 0; i < localStorage.length; i++){
      var key = localStorage.key(i);

      if (exclude.indexOf(key) === -1) {
          localStorage.removeItem(key);
      }
  }
  }

}
