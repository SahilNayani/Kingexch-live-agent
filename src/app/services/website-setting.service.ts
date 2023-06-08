import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpHeaderResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class WebsiteSettingService {

  public Base_Url = environment['adminServerUrl'];
  public token = localStorage.getItem('adminAccessToken');


  constructor(private http: HttpClient, private cookie: CookieService) { }

  reqHeader = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ` + this.token
  });

  addUpdateWebsiteSetting(param) {
    if (param.hasOwnProperty("id") && param.id != "") {
      return this.http.post<any>(this.Base_Url + 'website/updateWebsite/' + param.id, param, { headers: this.reqHeader });
    } else {
      return this.http.post<any>(this.Base_Url + 'website/createWebSiteSetting', param, { headers: this.reqHeader });
    }
  }



  getAllwebsite() {
    return this.http.get<any>(this.Base_Url + 'website/getAllWebsite', { headers: this.reqHeader });
  }

  deleteWebsite(id, data) {
    return this.http.post<any>(this.Base_Url + 'website/deleteWebsiteDomain/' + id, data, { headers: this.reqHeader });
  }

  WebsiteNameChecking(data) {
    return this.http.post<any>(this.Base_Url + 'website/checkWebsiteName', data, { headers: this.reqHeader });
  }

  siteTitleChecking(data) {
    return this.http.post<any>(this.Base_Url + 'website/checkSiteTitleData', data, { headers: this.reqHeader });
  }

  WebsiteNameSearch(data) {
    return this.http.post<any>(this.Base_Url + 'website/searchDomains', data, { headers: this.reqHeader });
  }


}
