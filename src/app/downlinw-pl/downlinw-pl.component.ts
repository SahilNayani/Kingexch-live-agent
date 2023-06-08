import { Component, OnInit, ViewChild, TemplateRef,AfterViewInit ,OnDestroy  } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { DateTime } from '../../dateTime';
import { Router } from '@angular/router';
import { PopoverDirective } from 'ngx-bootstrap/popover';
import { Location } from '@angular/common';
import { ReportService } from '../services/report.service';
import { SportService } from '../services/sport.service';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
import { DataTableDirective } from 'angular-datatables';
import { HeaderComponent } from '../header/header.component';
import { Subject } from 'rxjs';
import { UsersService } from '../services/users.service';
import { environment } from '../../environments/environment';
import { HttpClient, HttpResponse,HttpHeaders } from '@angular/common/http';
const _ = require("lodash");
class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
}
@Component({
  selector: 'app-downlinw-pl',
  templateUrl: './downlinw-pl.component.html',
  styleUrls: ['./downlinw-pl.component.scss'],
  providers: [HeaderComponent],
})
export class DownlinwPlComponent implements AfterViewInit,OnDestroy,OnInit {
  modalRef: BsModalRef;
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  moment: any = moment;
  todayDate: Date = new Date();
  @ViewChild('startpopoverRef') private _startpopoverRef: PopoverDirective;
  @ViewChild('endpopoverRef') private _endpopoverRef: PopoverDirective;
  time: Date;
  date: Date;
  endDate: Date;
  endTime: Date;
  isDateVisible: boolean = true;
  isMeridian: boolean = false;
  startdateTime = new Date();
  enddateTime = new Date();
  startAt: Date = new Date()
  todayDateTime: Date = new Date();
  itemsPerPage: number = 50;
  currentPage: number = 1;
  totalItems: number = 0;
  type: any;
  adminDetails: any;
  a: any = [];
  userPlList: any=[];
  gameList: any;
  Id: any;
  event_id: any;
  type_id: any;
  userName: any;
  parentId: any;
  searchUser:any;
  profitloss: any;
  downlineprofitloss: any;
  commission: any;
  user_id: any;
  walletBalance: any;
  public Base_Url = environment['adminServerUrl'];
  public token = localStorage.getItem('adminAccessToken');
  reqHeader = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ` + this.token
  });
  userId: any;
  constructor(private http: HttpClient,private usersService: UsersService,private sport: SportService, private router: Router,private head: HeaderComponent, private modalService: BsModalService, private locationBack: Location, private reportService: ReportService, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.adminDetails = JSON.parse(localStorage.getItem('adminDetails'));
    this.type = this.adminDetails.user_type_id;
    this.userId = this.adminDetails.user_id;
    this.todayDateTime.setHours(23, 59, 59);
    this.startdateTime.setHours(0, 0, 0, 0);
    this.enddateTime.setHours(23, 59, 59);
    this.startAt.setHours(23, 59, 59);
    // this.sportsPl('','filterBtnClick');
    const that = this;
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 50,
      searching: true, 
      paging: true,
      serverSide: true,
      processing: true,
      ajax: (dataTablesParameters1: any, callback) => {
        let dataTablesParameters = {
          // if (that.statementStartDate) {
            "user_id": this.userId ,
            "search": {
              "event_id": this.event_id == undefined ? '' : this.event_id,
              "type": this.type_id == 1 ? '' : this.type_id
            },
            // "from_date": this.startdateTime.toISOString(),
            // "to_date": this.enddateTime.toISOString()
            "from_date": this.startdateTime.toISOString(),
            "to_date":  this.enddateTime.toISOString(),
        }
        // this.fromDate = this.startdateTime.toISOString();
        // this.toDate =   this.enddateTime.toISOString();
        if(dataTablesParameters.user_id == undefined){
          delete dataTablesParameters.user_id
        }
        if (dataTablesParameters.search.event_id == '') {
          delete dataTablesParameters.search.event_id
        }
        if (dataTablesParameters.search.type == '') {
          delete dataTablesParameters.search.type
        }
    
        if (dataTablesParameters.search.event_id == undefined && dataTablesParameters.search.type == undefined) {
          delete dataTablesParameters.search;
        }
        this.a = []
        // dataTablesParameters1.search.value != "" ? dataTablesParameters["search"] = (dataTablesParameters1.search.value) : ""
        // that.http.post<DataTablesResponse>('https://angular-datatables-demo-server.herokuapp.com/',dataTablesParameters, {})
        that.http.post<DataTablesResponse>(this.Base_Url + 'report/downlineP_L', dataTablesParameters, { headers: this.reqHeader })
        .subscribe(resp => {
            if(resp["status"]){
              this.userPlList = resp.data;
             
              for (let i = 0; i < this.userPlList.length; i++) {
                this.userPlList[i].profitloss = (this.userPlList[i].total)
                if(this.userPlList[i].total >= 0){
                  this.userPlList[i].downlineprofitloss = -(this.userPlList[i].total - this.userPlList[i].commission)
                } else {
                  this.userPlList[i].downlineprofitloss = -(this.userPlList[i].total + this.userPlList[i].commission)
                }
              }
              this.profitloss = this.userPlList.reduce(
                (a: number, b) => a + b.profitloss, 0);
              this.downlineprofitloss = this.userPlList.reduce(
                (a: number, b) => a + b.downlineprofitloss, 0);
              this.commission = this.userPlList.reduce(
                (a: number, b) => a + b.commission, 0);
              
                callback({
                  recordsTotal: this.userPlList.length,
                  recordsFiltered: this.userPlList.length,
                  data: this.userPlList
                });
                
            } else {
              this.toastr.error(resp["msg"]);
              this.userPlList = []
              callback({
                recordsTotal: 0,
                recordsFiltered: 0,
                data: this.userPlList
              });
            }

           
          });
      },
      columns: [
        {
          title: 'User Name',
          data: 'user_name',
          "render": function (data, type, row) {
            var content = '';
              content = content + '<span style="color: #14805e !important;cursor: pointer;">' + row.user_name + '</span>';
            return content;
          }
        },
        {
          title: 'Upline Profit/Loss',
          data: 'profitloss',
          "render": function (data, type, row) {
            var content = ''
            if (row.profitloss != null && row.profitloss < 0) {
              content = content + '<span class="text-center text-danger">' + (row.profitloss).toFixed(2) + '</span>';
            } else if (row.profitloss != null && row.profitloss >= 0) {
              content = content + '<span class="text-center text-success">' + (row.profitloss).toFixed(2) + '</span>';
            } else {
              content = '';
            }
            return content;
          }

        }, 
        { 
          title: 'Downline Profit/Loss', 
          data: 'downlineprofitloss',
          "render": function (data, type, row) {
            var content = ''
            if (row.downlineprofitloss != null && row.downlineprofitloss < 0) {
              content = content + '<span class="text-center text-danger">' + (row.downlineprofitloss).toFixed(2) + '</span>';
            } else if (row.downlineprofitloss != null && row.downlineprofitloss >= 0) {
              content = content + '<span class="text-center text-success">' + (row.downlineprofitloss).toFixed(2) + '</span>';
            } else {
              content = '';
            }
            return content;
          }
        }, 
        { 
          title: 'Commission', 
          data: 'commission',
          "render": function (data, type, row) {
            var content = ''
            if (row.commission != null && row.commission < 0) {
              content = content + '<span class="text-center text-danger">' + (row.commission).toFixed(2) + '</span>';
            } else if (row.commission != null && row.commission >= 0) {
              content = content + '<span class="text-center text-success">' + (row.commission).toFixed(2) + '</span>';
            } else {
              content = '';
            }
            return content;
          }
        }],
      rowCallback :(row: Node, data: any[] | Object, index: number) => {
        const self = this;
        $('td', row).off('click');
        $('td', row).on('click',()=> {
          this.userId = data["user_id"]
          if(data["user_type_id"] != "1"){
            this.rerender();
          }
        });
        $( row ).addClass('text-center');
        return row; 
      }
    };
    // this.downlinePL();
    if (this.startdateTime) {
      this.time = this.date = this.startdateTime;
      return;
    }
    if (this.enddateTime) {
      this.time = this.date = this.enddateTime;
      return;
    }
    this.date = this.time = new Date();
  }
  sportsPl(id, from?: string) {
    this.Id = id;
    let data = {
      "user_id": id == '' ? this.adminDetails.user_id : id,
      "search": {
        "event_id": this.event_id == undefined ? '' : this.event_id,
        "type": this.type_id == 1 ? '' : this.type_id
      }
    };
    if (from == 'filterBtnClick') {
      if (this.startdateTime) {
        data["from_date"] = this.startdateTime.toISOString()
      }
      if (this.enddateTime) {
        data["to_date"] = this.enddateTime.toISOString()
      }
    }
    if (data.search.event_id == '') {
      delete data.search.event_id
    }
    if (data.search.type == '') {
      delete data.search.type
    }

    if (data.search.event_id == undefined && data.search.type == undefined) {
      delete data.search;
    }
    this.a = []
    if (from == 'filterBtnClick') {
      // if (this.startdateTime) {
      //   data["from_date"] = this.startdateTime.toISOString()

      // }
      // if (this.enddateTime) {
      //   data["to_date"] = this.enddateTime.toISOString()
      // }
    }
    this.reportService.downlinepl(data).subscribe((res) => {
      if (res.status == true) {
        this.userPlList = res.data;
        this.userName = res.user_name;
        // this.parentId = res.parent_id;
        for (let i = 0; i < this.userPlList.length; i++) {
          this.userPlList[i].profitloss = (this.userPlList[i].total)
          if(this.userPlList[i].total >= 0){
            this.userPlList[i].downlineprofitloss = -(this.userPlList[i].total - this.userPlList[i].commission)
          } else {
            this.userPlList[i].downlineprofitloss = -(this.userPlList[i].total + this.userPlList[i].commission)
          }
        }
        this.profitloss = this.userPlList.reduce(
          (a: number, b) => a + b.profitloss, 0);
        this.downlineprofitloss = this.userPlList.reduce(
          (a: number, b) => a + b.downlineprofitloss, 0);
        this.commission = this.userPlList.reduce(
          (a: number, b) => a + b.commission, 0);
          // this.rerender();
          this.dtElement.dtInstance.then((dtInstance) => {
            // Destroy the table first
            dtInstance.destroy();
            // Call the dtTrigger to rerender again
            this.dtTrigger.next();
          });
      } else {
        this.userPlList = []
        if (res.logout == true) {
          this.head.logoutUser();
        }
      }
    })
  }
  getWalletBallance() {
    let data ={};
    this.usersService.getUserBalance(data).subscribe(response => {
      this.walletBalance = response.data;
    })
  }

  goToBack() {
    this.locationBack.back();
  }


  dateSelectionDone() {
    this.isDateVisible = true;
  }

  updateDate() {

    if (this.date) {
      this.startdateTime = DateTime.getDateTime(this.date, this.time);
    }
    if (!this.time) {
      this.time = this.date;
    }
  }

  updateEndDate() {
    if (this.endDate) {
      this.enddateTime = DateTime.getDateTime(this.endDate, this.endTime);
      this.enddateTime.setHours(23, 59, 59);
    }
    // if (!this.endTime) {
    //   this.endTime = this.endDate;
    // }
  }
  updateTime() {
    if (this.time) {
      this.startdateTime = DateTime.getDateTime(this.date, this.time);
    }
  }
  updateEndTime() {
    if (this.endTime) {
      this.enddateTime = DateTime.getDateTime(this.endDate, this.endTime);
    }
  }


  showDate() {
    this.isDateVisible = true;
  }

  showTime() {
    this.isDateVisible = false;
  }

  close() {
    this._startpopoverRef.hide();

  }
  closeEndDatepicker() {
    this._endpopoverRef.hide()
  }
  now() {
    this.startdateTime = DateTime.now(this.date);
    this.time = this.startdateTime;
    this.enddateTime = DateTime.now(this.date);
    this.time = this.enddateTime;
  }

  today() {
    this.date = this.time = new Date();
    this.startdateTime = DateTime.now(this.date);
    this.enddateTime = DateTime.now(this.date);
  }
  pageChange(event?: any) {
    if (event) {
      this.currentPage = event
    }else{
      this.currentPage=1
    }
    // if(this.openBetFilter == false){
    // this.openBets('filterBtnClick');
    // } else {
    //   this.getOpenBetFilterData(this.filterParam[0], this.filterParam[1], this.filterParam[2],'','filterBtnClick')
    // }
    
  }

  addCssClass(data) {
    if (data < 0 || data == undefined || data == null || data == '') {
      return 'red'
    } else {
      return 'green'
    }
  }
  ngAfterViewInit(): void {
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
  
}
