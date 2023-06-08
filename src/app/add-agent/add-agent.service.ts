import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpHeaderResponse } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class AddAgentService {

  public Base_Url = environment.adminServerUrl;

 public token =  localStorage.getItem('adminAccessToken');

  constructor(private http: HttpClient , private cookie: CookieService ) { }

  reqHeader = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ` + this.token 
  });


  
  addAgent(agentForm) {
    return this.http.post<any>(this.Base_Url + 'user/register',agentForm, { headers: this.reqHeader });
  }
  checkUserName(agentForm) {
    return this.http.post<any>(this.Base_Url + 'user/checkUserName',agentForm, { headers: this.reqHeader });
  }
  
}
