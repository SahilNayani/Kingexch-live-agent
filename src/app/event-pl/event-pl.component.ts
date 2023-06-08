import { Component, OnInit, ViewChild, TemplateRef,AfterViewInit ,OnDestroy } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { DateTime } from '../../dateTime';
import { Router , ActivatedRoute} from '@angular/router';
import { PopoverDirective } from 'ngx-bootstrap/popover';
import { Location } from '@angular/common';
import { ReportService } from '../services/report.service';
import { SportService } from '../services/sport.service';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
import { DataTableDirective } from 'angular-datatables';
import { HttpClient, HttpResponse,HttpHeaders } from '@angular/common/http';
import { Subject } from 'rxjs';
const _ = require("lodash");
import { environment } from '../../environments/environment';
import { UsersService } from '../services/users.service';
class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
}
@Component({
  selector: 'app-event-pl',
  templateUrl: './event-pl.component.html',
  styleUrls: ['./event-pl.component.scss']
})
export class EventPlComponent implements AfterViewInit,OnDestroy,OnInit {
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
  sportPlList:any;
  searchSport:any;
  profitloss: any;
  downlineprofitloss: any;
  commission: any;
  public Base_Url = environment['adminServerUrl'];
  fromDate: string;
  toDate: string;
  user_id: any;
  walletBalance: any;
  public token = localStorage.getItem('adminAccessToken');
  reqHeader = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ` + this.token
  });
  constructor(private http: HttpClient,private usersService: UsersService,private route: ActivatedRoute,private sport: SportService, private router: Router, private modalService: BsModalService, private locationBack: Location, private reportService: ReportService, private toastr: ToastrService) {
    this.route.params.subscribe(params => {
      this.user_id = params.userId;
    })
   }

  ngOnInit(): void {
    this.adminDetails = JSON.parse(localStorage.getItem('adminDetails'));
    this.type = this.adminDetails.user_type_id;
    this.todayDateTime.setHours(23, 59, 59);
    this.startdateTime.setHours(0, 0, 0, 0);
    this.enddateTime.setHours(23, 59, 59);
    this.startAt.setHours(23, 59, 59);
    // this.eventpl('filterBtnClick');
    const that = this;
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 50,
      searching: false, 
      paging: false,
      serverSide: true,
      processing: true,
      ajax: (dataTablesParameters1: any, callback) => {
        let dataTablesParameters = {
          // if (that.statementStartDate) {
            user_id : this.user_id,
            is_user: true,
            // "from_date": this.startdateTime.toISOString(),
            // "to_date": this.enddateTime.toISOString()
            "from_date": this.startdateTime.toISOString(),
            "to_date":  this.enddateTime.toISOString(),
        }
        this.fromDate = this.startdateTime.toISOString();
        this.toDate =   this.enddateTime.toISOString();
        if(dataTablesParameters.user_id == undefined){
          delete dataTablesParameters.user_id
          delete dataTablesParameters.is_user
        }
        
        dataTablesParameters1.search.value != "" ? dataTablesParameters["search"] = (dataTablesParameters1.search.value) : ""
        // that.http.post<DataTablesResponse>('https://angular-datatables-demo-server.herokuapp.com/',dataTablesParameters, {})
        that.http.post<DataTablesResponse>(this.Base_Url + 'report/sportsP_L', dataTablesParameters, { headers: this.reqHeader })
        .subscribe(resp => {
            if(resp["status"]){
              this.sportPlList = resp.data;
              if(this.user_id == undefined){
                for (let i = 0; i < this.sportPlList.length; i++) {
                  this.sportPlList[i].downlineprofitloss = (this.sportPlList[i].total)
                  if(this.sportPlList[i].total > 0){
                    this.sportPlList[i].profitloss = -(this.sportPlList[i].total + this.sportPlList[i].commission)
                  } else {
                    this.sportPlList[i].profitloss = -(this.sportPlList[i].total + this.sportPlList[i].commission)
                  }
                }
              } else {
                for (let i = 0; i < this.sportPlList.length; i++) {
                  this.sportPlList[i].downlineprofitloss = (this.sportPlList[i].total)
                  if(this.sportPlList[i].total > 0){
                    this.sportPlList[i].profitloss = -(this.sportPlList[i].total + this.sportPlList[i].commission)
                  } else {
                    this.sportPlList[i].profitloss = -(this.sportPlList[i].total + this.sportPlList[i].commission)
                  }
                }
              }
              
              this.profitloss = this.sportPlList.reduce(
                (a: number, b) => a + b.profitloss, 0);
              this.downlineprofitloss = this.sportPlList.reduce(
                (a: number, b) => a + b.downlineprofitloss, 0);
              this.commission = this.sportPlList.reduce(
                (a: number, b) => a + b.commission, 0);
                callback({
                  recordsTotal: this.sportPlList.length,
                  recordsFiltered: this.sportPlList.length,
                  data: this.sportPlList
                });
                
            } else {
              this.toastr.error(resp["msg"]);
              this.sportPlList = []
              callback({
                recordsTotal: 0,
                recordsFiltered: 0,
                data: this.sportPlList
              });
            }

           
          });
      },
      columns: [
        {
          title: 'Sport Name',
          data: 'sport_name',
          "render": function (data, type, row) {
            var content = '';
              content = content + '<span style="color: #14805e !important;cursor: pointer;">' + row.sport_name + '</span>';
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
          this.eventWisePl(data);
        });
        $( row ).addClass('text-center');
        return row; 
      }
    };
    this.getWalletBallance();
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

  getWalletBallance() {
    let data = {};
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
  }

  eventpl(from?: string){
    let data = {
      user_id : this.user_id,
      is_user: true
    }
    if(data.user_id == undefined){
      delete data.user_id
      delete data.is_user
    }
    if (from == 'filterBtnClick') {
      if (this.startdateTime) {
        data["from_date"] = this.startdateTime.toISOString()
        this.fromDate = this.startdateTime.toISOString()
      }
      if (this.enddateTime) {
        data["to_date"] = this.enddateTime.toISOString()
        this.toDate = this.enddateTime.toISOString()
      }
    }
    this.reportService.eventpl(data).subscribe((res)=> {
      if(res.status){
        this.sportPlList = res.data;
        if(this.user_id == undefined){
          for (let i = 0; i < this.sportPlList.length; i++) {
            this.sportPlList[i].downlineprofitloss = (this.sportPlList[i].total)
            if(this.sportPlList[i].total > 0){
              this.sportPlList[i].profitloss = -(this.sportPlList[i].total + this.sportPlList[i].commission)
            } else {
              this.sportPlList[i].profitloss = -(this.sportPlList[i].total + this.sportPlList[i].commission)
            }
          }
        } else {
          for (let i = 0; i < this.sportPlList.length; i++) {
            this.sportPlList[i].downlineprofitloss = (this.sportPlList[i].total)
            if(this.sportPlList[i].total > 0){
              this.sportPlList[i].profitloss = -(this.sportPlList[i].total + this.sportPlList[i].commission)
            } else {
              this.sportPlList[i].profitloss = -(this.sportPlList[i].total + this.sportPlList[i].commission)
            }
          }
        }
        
        this.profitloss = this.sportPlList.reduce(
          (a: number, b) => a + b.profitloss, 0);
        this.downlineprofitloss = this.sportPlList.reduce(
          (a: number, b) => a + b.downlineprofitloss, 0);
        this.commission = this.sportPlList.reduce(
          (a: number, b) => a + b.commission, 0);
      } else {
        this.toastr.error(res.msg);
        this.sportPlList = []
      }
      
      
    })
  }
  eventWisePl(data){
    if(this.user_id == undefined){
      let a = this.Base_Url.split('api/v1/');
      // let b = 'http://192.168.0.8:4100/' + 'plMatchwise/' + data.sport_id + '/'+ data.sport_name + '/'+ this.fromDate + '/'+ this.toDate + '/' + data.type;
      let b = a[0] + 'plMatchwise/' + data.sport_id + '/'+ data.sport_name + '/'+ this.fromDate + '/'+ this.toDate + '/' + data.type;
      window.open(b, '_blank', 'location=yes,height=570,width=520,scrollbars=yes,status=yes');
    } else {
      let a = this.Base_Url.split('api/v1/');
    // let b = 'http://192.168.0.8:4100/' + 'plMatchwise/' + data.sport_id + '/'+ data.sport_name + '/'+ this.fromDate + '/'+ this.toDate + '/' + this.user_id + '/' + data.type;
    let b = a[0] + 'plMatchwise/' + data.sport_id + '/'+ data.sport_name + '/'+ this.fromDate + '/'+ this.toDate + '/' + this.user_id + '/' + data.type;
    window.open(b, '_blank', 'location=yes,height=570,width=520,scrollbars=yes,status=yes');
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
