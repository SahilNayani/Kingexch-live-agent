import { Component, OnInit, ViewChild,TemplateRef,AfterViewInit ,OnDestroy } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { DateTime } from '../../dateTime';
import { PopoverDirective } from 'ngx-bootstrap/popover';
import { Router, ActivatedRoute } from "@angular/router";
import { ToastrService } from 'ngx-toastr';
import { CookieService } from 'ngx-cookie-service';
import { ReportService } from '../services/report.service';
import { SportService } from '../services/sport.service';
import { SocketServiceService } from '../services/socket-service.service';
import { Location } from '@angular/common';
import { DatePipe } from '@angular/common';
import { OwlDateTimeComponent, DateTimeAdapter, OWL_DATE_TIME_FORMATS, OWL_DATE_TIME_LOCALE } from 'ng-pick-datetime';
import * as moment from 'moment';
import { Moment } from 'moment';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { HttpClient, HttpResponse,HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
}
@Component({
  selector: 'app-account-statement',
  templateUrl: './account-statement.component.html',
  styleUrls: ['./account-statement.component.scss'],
  providers: [DatePipe]
})
export class AccountStatementComponent implements AfterViewInit,OnDestroy,OnInit {
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  statementType: any = [];
  user_id: any;
  update_user_id: any;
  data: any;
  statementList: any=[];
  isSocket;
  modalRef: BsModalRef;
  @ViewChild('startpopoverRef') private _startpopoverRef: PopoverDirective;
  @ViewChild('endpopoverRef') private _endpopoverRef: PopoverDirective;
  time: Date;
  date: Date;
  endDate: Date;
  endTime: Date;
  isDateVisible: boolean = true;
  isMeridian: boolean = false;
  // startdateTime: any
  // enddateTime: any
  selections: any = "0";
  radioSelect = "0"
  startdateTime: Date = new Date()
  enddateTime: Date = new Date()
  minTime: Date = new Date()
  maxTime: Date = new Date()
  startAt: Date = new Date()
  todayDateTime:Date=new Date()
  itemsPerPage: number = 50;
  currentPage: number = 1;
  totalItems: number = 0;
  userParentName: any;
  parentList: any;
  update_user_Type_id: any;
  moment: any = moment;
  public Base_Url = environment['adminServerUrl'];
  public token = localStorage.getItem('adminAccessToken');
  reqHeader = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ` + this.token
  });
  constructor(private http: HttpClient,private datePipe: DatePipe, private report: ReportService, private router: Router,private modalService: BsModalService,
    private toastr: ToastrService, private locationBack: Location, private route: ActivatedRoute,private sport: SportService,
    private cookie: CookieService, private socketService: SocketServiceService) {

      
    this.route.params.subscribe(params => {
      this.update_user_id = params.id;
      this.update_user_Type_id = params.userTypeId;
    });
  }

  async ngOnInit() {

    this.statementType = {
      '0': 'Statement',
      '1': 'Free Chips',
      '4': 'Settlement',
      '2': 'Profit Loss',
      '3': 'Commission'
    };
    this.user_id = localStorage.getItem('userId');
    // await this.socketService.setUpSocketConnection();
    this.isSocket = this.cookie.get('is_socket');
    // if (this.update_user_id == null || this.update_user_id == undefined || this.update_user_id == '') {
    //   this.update_user_id = this.user_id;
    // }
    this.todayDateTime.setHours(23, 59, 59);
    this.startdateTime.setHours(0, 0, 0, 0);
    this.enddateTime.setHours(23, 59, 59);
    this.startAt.setHours(23, 59, 59);
    // this.getStatement('filterBtnClick');
    const that = this;
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 50,
      searching: false, 
      paging: true,
      serverSide: true,
      processing: true,
      ajax: (dataTablesParameters1: any, callback) => {
        let dataTablesParameters = {
          "statement_type": '1',
          "user_id": this.update_user_id == undefined ? this.user_id : this.update_user_id,
          page: (dataTablesParameters1.start/ dataTablesParameters1.length)+1,
          limit: dataTablesParameters1.length,
          "from_date": this.startdateTime.toISOString(),
          "to_date": this.enddateTime.toISOString(),
        }
        that.http.post<DataTablesResponse>(this.Base_Url + 'account/statements', dataTablesParameters, { headers: this.reqHeader })
        .subscribe(resp => {
            if(resp["status"]){
              if((resp.data[0].metadata).length != 0){
                this.statementList = resp.data[0].data;
                for(let i = 0;i<this.statementList.length;i++){
                  this.statementList[i].updateDateTime = moment(this.statementList[i].date).utcOffset("+5:30").format('DD-MM-YYYY HH:mm:ss');
                  if(this.statementList[i].credit_debit >= 0){
                   this.statementList[i].credit = this.statementList[i].credit_debit
                   this.statementList[i].debit = (0)
                  } else {
                   this.statementList[i].credit = (0)
                   this.statementList[i].debit = -(this.statementList[i].credit_debit)
                  }
               }
                callback({
                  recordsTotal: resp.data[0].metadata[0].total,
                  recordsFiltered: resp.data[0].metadata[0].total,
                  data: this.statementList
                });
              } else {
                this.statementList = []
                callback({
                  recordsTotal: 0,
                  recordsFiltered: 0,
                  data: this.statementList
                });
              }
            } else {
              this.toastr.error(resp["msg"]);
              this.statementList = []
              callback({
                recordsTotal: 0,
                recordsFiltered: 0,
                data: this.statementList
              });
            }

           
          });
      },
      columns: [
        { 
          title: 'Date & Time',
          data: 'updateDateTime' 
        },
        { 
          title: 'Deposit',
          data: 'credit',
          "render": function (data, type, row) {
            var content = ''
            content = content + '<span >' + (row.credit == 0 ? '(0)' : (row.credit).toFixed(2)) + '</span>';
            return content;
          }   
        }, 
        { 
          title: 'Withdraw',
          data: 'debit',
          "render": function (data, type, row) {
            var content = ''
            content = content + '<span style="color: red;">' + (row.debit == 0 ? '(0)':(row.debit).toFixed(2)) + '</span>';
            return content;
          }  
        },
        { 
          title: 'Balance',
          data: 'balance',
          "render": function (data, type, row) {
            var content = ''
            content = content + '<span >' + (row.balance).toFixed(2) + '</span>';
            return content;
          }   
        }, 
        { 
          title: 'Remark',
          data: 'remark' 
        }, 
        { 
          title: 'From / To',
          data: 'description' 
        }],
      rowCallback :(row: Node, data: any[] | Object, index: number) => {
        const self = this;
        $( row ).addClass('text-center');
        return row; 
      }
    };
    this.minTime.setHours(0);
    this.minTime.setMinutes(0);
    this.maxTime.setHours(23);
    this.maxTime.setMinutes(59);
    this.maxTime.setSeconds(59);
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
  //   this.socketOnEvent(`accountSatement`, data => {
  //     if (data.status == true) {
  //       this.statementList = data.data;
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
  clear() {
    //https://valor-software.com/ngx-bootstrap/#/timepicker#dynamic
    //Check component DemoTimepickerDynamicComponent  -> clear() method;  void 0 evaluates to undefined
    this.time = void 0;
    this.date = void 0;
    this.startdateTime = void 0;
    this.enddateTime = void 0;
  
  }

  getStatement(from?: string) {

    this.data = {
      "statement_type": '1',
      "user_id": this.update_user_id == undefined ? this.user_id : this.update_user_id,
      "limit": this.itemsPerPage,
      "page": this.currentPage
    }
    if (this.data.statement_type == undefined || this.data.statement_type == null || this.data.statement_type == 0) {
      delete this.data.statement_type;
    }

    if (from == 'filterBtnClick') {
      //this.data['search'] = {}
      if (this.startdateTime) {
        this.data["from_date"] = this.startdateTime.toISOString()

      }
      if (this.enddateTime) {
        this.data["to_date"] = this.enddateTime.toISOString()
      }
    }

      this.report.statements(this.data).subscribe(data => {
        if (data.status == true) {
          this.statementList = data.data[0].data;
          // if(this.statementList.length == 0 && data.data[0].metadata[0] && data.data[0].metadata[0].total != 0){
          //   this.currentPage = 1;
          //   this.getStatement('filterBtnClick');/
          // }
          for(let i = 0;i<this.statementList.length;i++){
            this.statementList[i].updateDateTime = moment(this.statementList[i].date).utcOffset("+5:30").format('DD-MM-YYYY HH:mm:ss');
            if(this.statementList[i].credit_debit >= 0){
             this.statementList[i].credit = this.statementList[i].credit_debit
             this.statementList[i].debit = (0)
            } else {
             this.statementList[i].credit = (0)
             this.statementList[i].debit = -(this.statementList[i].credit_debit)
            }
         }
          if(data.data[0].metadata[0]){
            this.totalItems = data.data[0].metadata[0].total
            this.currentPage = data.data[0].metadata[0].page
          }
        } else {
          this.toastr.error(data.msg, '', {
            timeOut: 10000,
          });
        }
      })

  }

  onClickClear(){
    this.startdateTime = new Date();
    this.enddateTime = new Date()
    this.startdateTime.setHours(0, 0, 0, 0);
    this.enddateTime.setHours(23, 59, 59);
  
    this.getStatement('filterBtnClick')
  }
  onSelectionChange(data) {
    this.radioSelect
    this.selections = data;
    this.getStatement('filterBtnClick')

  }


  chosenMonthHandler(normalizedMonth: Moment, datepicker: OwlDateTimeComponent<Moment>) {
    datepicker.close();
  }

  pageChange(event?:any) {
    if(event){
      this.currentPage = event
    }
   
    this.getStatement('filterBtnClick')
  }

  openModalUserParentList(user, userParentList: TemplateRef<any>) {
    this.modalRef = this.modalService.show(
      userParentList,
      Object.assign({}, { class: 'modal-lg' })
    );
    this.userParentName = user.user_name;
    let data ={
      "user_id" : user.user_id
    }
    this.sport.showParentList(data).subscribe((res) => {
      if(res.status == true){
        this.parentList = res.data.agents ;
      } else {
        this.toastr.error(res.msg, '', {
          timeOut: 10000,
        })
      }
    })
  }

  routePath(list){
    if(list.user_type_id == 1){
      this.goToViewBets(list);
    } else {
      this.goToSportsPl(list);
    }
  }
  goToViewBets(data){
    this.router.navigate(['viewBet/' + data.match_id + '/' + data.event_id + '/' + data.type +  '/' + data.description+ '/' + data.user_id])
  }

  goToSportsPl(profit) {
    this.router.navigate(['sport-pl/' + profit.event_id + '/' + profit.type + '/' + profit.match_id + '/' + profit.description + '/' + profit.user_id])
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
