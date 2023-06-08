import { HttpClient, HttpResponse,HttpHeaders } from '@angular/common/http';
import { Component, OnInit, ViewChild, TemplateRef,AfterViewInit ,OnDestroy,Renderer2  } from '@angular/core';
import { UsersService } from '../services/users.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { CookieService } from 'ngx-cookie-service';
import Swal from 'sweetalert2'
import { ToastrService } from 'ngx-toastr';
import { Location } from '@angular/common';
import { SocketServiceService } from '../services/socket-service.service';
import * as moment from 'moment';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { environment } from '../../environments/environment';
class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
}
@Component({
  selector: 'app-closed-user',
  templateUrl: './closed-user.component.html',
  styleUrls: ['./closed-user.component.scss']
})
export class ClosedUserComponent implements AfterViewInit,OnDestroy,OnInit {
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  moment: any = moment;
  modalRef: BsModalRef;
  public Base_Url = environment['adminServerUrl'];
  public token = localStorage.getItem('adminAccessToken');
  reqHeader = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ` + this.token
  });
  user_id: any;
  userList = [];
  itemsPerPage: number = 10;
  currentPage: number = 1;
  total_items: number = 0;
  usersListReqPageQuery: any;
  levelParentUserId: string = null;
  selectedUserId;
  isSocket;
  selectedUser: any;
  constructor(private modalService: BsModalService,private renderer: Renderer2,private usersService: UsersService, private cookie: CookieService,private http: HttpClient
    , private toastr: ToastrService, private locationBack: Location, private socketService: SocketServiceService) { }

  async ngOnInit() {
    // await this.socketService.setUpSocketConnection();
    this.isSocket = this.cookie.get('is_socket');
    this.user_id = localStorage.getItem('userId');
    // this.getClosedUsersList(this.user_id);
    const that = this;
    var dataTableLengthMenu = [500];
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 100,
      searching: false, 
      paging: true,
      serverSide: true,
      processing: true,
      lengthMenu : dataTableLengthMenu,
      ajax: (dataTablesParameters1: any, callback) => {
        let dataTablesParameters = {
          page: (dataTablesParameters1.start/ dataTablesParameters1.length)+1,
          limit: dataTablesParameters1.length,
        }
        console.log("104",dataTablesParameters);
        // dataTablesParameters1.search.value != "" ? dataTablesParameters["search"] = (dataTablesParameters1.search.value) : ""
        // that.http.post<DataTablesResponse>('https://angular-datatables-demo-server.herokuapp.com/',dataTablesParameters, {})
        that.http.post<DataTablesResponse>(this.Base_Url + 'user/closedUsersList', dataTablesParameters, { headers: this.reqHeader })
        .subscribe(resp => {
            if(resp["status"]){
              this.userList = resp.data;
              for (let i = 0; i < this.userList.length; i++) {
                this.userList[i].updateDateTime = moment(this.userList[i].createdAt).utcOffset("+5:30").format('DD-MM-YYYY HH:mm:ss');
              }
                callback({
                  recordsTotal: resp["metadata"].total,
                  recordsFiltered: resp["metadata"].total,
                  data: this.userList
                });
                
            } else {
              this.toastr.error(resp["msg"]);
              this.userList = []
              callback({
                recordsTotal: 0,
                recordsFiltered: 0,
                data: this.userList
              });
            }

           
          });
      },
      columns: [
        {
          title: 'User Name',
          data: 'user_name'
        },
        {
          title: 'Name',
          data: 'name',
        },
        {
          title: 'Date & Time',
          data: 'updateDateTime',
        },
        {
          title : 'Action',
          "render": function (data, type, row) {
            var content = ''
            content = content + "<button class='btn btn-primary btn-sm' (click)=openAccountOfUserAndTheirChilds("+ row._id + ","+ row.self_close_account + ")>Restore</button>"
            return content;
          }
        }],
      rowCallback :(row: Node, data: any[] | Object, index: number) => {
        const self = this;
        $( row ).addClass('text-center');
        return row;  
      }
    };
    // this.socketListenersUser();
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
  //   this.socketOnEvent(`getClosedUsersList`, data => {
  //     if (data.status == true) {
  //       this.userList = data.data;
  //       this.total_items = data.total;
  //     } else {
  //       this.toastr.error(data.msg,'',{
  //         timeOut: 10000,
  //       });
  //     }
  //   });

  //   this.socketOnEvent(`closeAndReOpenAccountOfUserAndTheirChilds`, data => {
  //     if (data.status == true) {
  //       if (this.levelParentUserId != null && this.levelParentUserId != undefined) {
  //         this.getSubUserChild();
  //       }
  //       else {
  //         this.getClosedUsersList(this.user_id);
  //       }

  //       this.toastr.success(data.msg,'',{
  //         positionClass: 'toast-bottom-right',
  //         timeOut:1000
  //        });
  //     } else {
  //       this.toastr.error(data.msg,'',{
  //         timeOut: 10000,
  //       });
  //     }
  //   });

  // }

  getClosedUsersList(id) {
    if (this.isSocket != 1) {
      this.usersListReqPageQuery = {
        page: this.currentPage,
        limit: this.itemsPerPage
      };
      this.usersService.getClosedUsersList(id, this.usersListReqPageQuery).subscribe(data => {
        this.userList = data.data;
      }, error => {
        console.log('errror')
      })
    }
    else {
      this.usersListReqPageQuery = {
        user_id: id,
        page: this.currentPage,
        limit: this.itemsPerPage
      };
      // this.socketEmitEvent('get-closed-users-list', this.usersListReqPageQuery);
    }
  }


  pageChange(newPage: number) {
    this.currentPage = newPage;
    this.usersListReqPageQuery = {
      page: this.currentPage,
      limit: this.itemsPerPage
    };
    if (this.levelParentUserId != null && this.levelParentUserId != undefined) {
      this.getSubUserChild();
    }
    else {
      this.getClosedUsersList(this.user_id);
    }
  }


  getClosedChild(id) {
    if (this.isSocket != 1) {
      this.levelParentUserId = id;
      this.usersListReqPageQuery = {
        page: 1,
        limit: this.itemsPerPage
      };
      this.getSubUserChild();
    }
    else {
      this.usersListReqPageQuery = {
        user_id: id,
        page: 1,
        limit: this.itemsPerPage
      };
      // this.socketEmitEvent('get-closed-users-list', this.usersListReqPageQuery);
    }
  }

  getSubUserChild() {
    if (this.isSocket != 1) {
      this.usersService.getClosedUsersList(this.levelParentUserId, this.usersListReqPageQuery).subscribe(data => {
        this.userList = data.data;
      }, error => {
        console.log('errror')
      })
    }
    else {
      // this.socketEmitEvent('get-closed-users-list', this.usersListReqPageQuery);
    }
  }

  openAccountOfUserAndTheirChilds() {
    console.log("244");
    
    var obj: any = {};
    var message = '';
    // if (self_close_account == 1) {
      obj.self_close_account = 0;
      message = "Are you sure you want to reopen this user account!"
    // }
    // this.selectedUserId = userid;
    Swal.fire({
      title: 'Are you sure?',
      text: message,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.isConfirmed) {
        if (this.isSocket != 1) {
          console.log("266",(this.selectedUserId));
          
          this.usersService.closeAndReOpenAccountOfUserAndTheirChilds(this.selectedUserId, obj).subscribe((result) => {
            if (result.status == true) {
              if (this.levelParentUserId != null && this.levelParentUserId != undefined) {
                this.getSubUserChild();
              }
              else {
                this.getClosedUsersList(this.user_id);
              }
              this.toastr.success(result.msg, '', {
                positionClass: 'toast-bottom-right',
                timeOut: 1000
              });
              this.rerender();
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
          obj.user_id = this.selectedUserId;
          // this.socketEmitEvent('close-and-re-open-account-of-user-and-their-childs', obj);
        }
      } else if (result.dismiss === Swal.DismissReason.cancel) {
      }
    })
  }
  ngAfterViewInit(): void {
    this.renderer.listen('document', 'click', (event) => {
      console.log("294",event,"\n",event.srcElement.attributes[1].value);
        var res = event.srcElement.attributes[1].value
        var res1 = res.split('(');
        var res2 = res1[1].split(')');
        var res3 = res2[0].split(',')
        console.log("298",res3);
        this.selectedUserId = res3[0]
        this.openAccountOfUserAndTheirChilds()
        // event.srcElement.attributes[1].value
      // if (event.target.hasAttribute("view-person-id")) {
      //   // this.router.navigate(["/person/" + event.target.getAttribute("view-person-id")]);
      // }
    });
    this.dtTrigger.next();
  }
  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }
  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.dtTrigger.next();
    });
  }
  openModalRestoreUser(restore: TemplateRef<any>, user) {
    this.selectedUser = user;
    this.modalRef = this.modalService.show(
      restore,
      Object.assign({}, { class: 'creditRefModal-modal modal-lg' })
    );
  }
}
