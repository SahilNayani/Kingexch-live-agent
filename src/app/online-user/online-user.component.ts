import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { Router ,ActivatedRoute} from '@angular/router';
import { UsersService } from '../services/users.service';
import { SocketServiceService } from '../services/socket-service.service';
import { CookieService } from 'ngx-cookie-service';
import * as moment from 'moment';
@Component({
  selector: 'app-online-user',
  templateUrl: './online-user.component.html',
  styleUrls: ['./online-user.component.scss']
})
export class OnlineUserComponent implements OnInit {
  login_user_id: string;
  onlineUserDetails: any;
  itemsPerPage: number = 100;
  currentPage: number = 1;
  total_items: number = 0;
  usersListReqPageQuery: any;
  moment: any = moment;
  isSocket;
  update_user_id: any;
  update_user_Type_id: any;
  constructor(private locationBack: Location, private usersService: UsersService,private route: ActivatedRoute,private router: Router,
    private toastr: ToastrService, private cookie: CookieService, private socketService: SocketServiceService) { 
      this.route.params.subscribe(params => {
        this.update_user_id = params.userid;
        this.update_user_Type_id = params.userTypeId;
      });
    }

  async ngOnInit() {
    // await this.socketService.setUpSocketConnection();
    this.isSocket = this.cookie.get('is_socket');
    this.getOnlineUsersList();
  }

  goToBack() {
    this.locationBack.back();
  }

  // socketOnEvent(eventName, callback) {
  //   this.socketService.socket.on(eventName, data => callback(data));
  // }

  // socketEmitEvent(eventName, data) {
  //   this.socketService.socket.emit(eventName, data);
  // }

  // socketListenersUser() {
  //   this.socketOnEvent(`getOnlineUsersList`, data => {
  //     if (data.status == true) {
  //       this.onlineUserDetails = data.data;
  //     } else {
  //       this.toastr.error(data.msg,'',{
  //         timeOut: 10000,
  //       });
  //     }
  //   });
  // }

  getOnlineUsersList() {
    if (this.isSocket != 1) {
      let data = {
        user_id: this.update_user_id == '' ? '' : this.update_user_id
      }
      if(data.user_id == '' || data.user_id == undefined){
        delete data.user_id
      }
      this.usersService.userActivity(data).subscribe(res => {
        if(res.status){
          this.onlineUserDetails = res.data
          console.log(this.onlineUserDetails, "this.onlineUserDetails");
        } else {
          this.onlineUserDetails = [];
          this.toastr.error(res.msg);
        }
        
      })
    }
    else {
      this.usersListReqPageQuery = {
        userid: this.login_user_id,
        page: this.currentPage,
        limit: this.itemsPerPage,
      };
      // this.socketEmitEvent('get-online-users-list', this.usersListReqPageQuery);
    }
  }

  setSelectedOption(selectedOption) {
    this.itemsPerPage = parseInt(selectedOption);
    this.usersListReqPageQuery = {
      page: this.currentPage,
      limit: this.itemsPerPage,
    };
    this.getOnlineUsersList();
  }

  pageChange(newPage: number) {
    this.currentPage = newPage;
    this.usersListReqPageQuery = {
      page: this.currentPage,
      limit: this.itemsPerPage,
    };
    this.getOnlineUsersList();
  }

  statement(id,type){
    this.router.navigate(['statement/'+id + '/' + type])
  }
  account(id,type){
    this.router.navigate(['account-info/'+ id + '/' + type])
  }
  openBet(id,type){
    this.router.navigate(['open-bet/'+ id + '/' + type])
  }
  proloss(id,type){
    this.router.navigate(['profit-loss/'+ id + '/' + type])
  }
  onlineUser(id,type){
    this.router.navigate(['online-user/'+ id + '/' + type])
  }
}
