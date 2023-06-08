import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { CookieService } from 'ngx-cookie-service';
import { environment } from '../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class SocketServiceService {
  socket: any;
  public token = localStorage.getItem('adminAccessToken');
  public Base_Url = environment['adminServerUrl'];
  constructor(private cookie: CookieService) {
    let a = this.Base_Url.split('/api/v1/')
    this.socket =io(a[0]+'?access_token='+this.token,{transports: ['websocket'],upgrade:false});
  }

  setUpSocketConnection() {
    let a = this.Base_Url.split('/api/v1/')
    this.socket =io(a[0]+'?access_token='+this.token,{transports: ['websocket'],upgrade:false});
  }
}
