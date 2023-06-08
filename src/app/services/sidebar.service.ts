import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpHeaderResponse, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { CookieService } from 'ngx-cookie-service';
@Injectable({
  providedIn: 'root'
})
export class SidebarService {
  public Base_Url = environment['adminServerUrl'];
  public token = localStorage.getItem('adminAccessToken');
  constructor(private http: HttpClient, private cookie: CookieService) { }
  reqHeader = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ` + this.token
  });
  getAllSportsList(request) {
    return this.http.post<any>(this.Base_Url + 'sports/getSports', request, { headers: this.reqHeader });
  }
}
