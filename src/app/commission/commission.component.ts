import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';
import { Component, OnInit, ViewChild, TemplateRef, AfterViewInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
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
import { Subject } from 'rxjs';
import { environment } from '../../environments/environment';
class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
}
@Component({
  selector: 'app-commission',
  templateUrl: './commission.component.html',
  styleUrls: ['./commission.component.scss']
})
export class CommissionComponent implements AfterViewInit, OnDestroy, OnInit {
  modalRef: BsModalRef;
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  moment: any = moment;
  public Base_Url = environment['adminServerUrl'];
  public token = localStorage.getItem('adminAccessToken');
  reqHeader = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ` + this.token
  });
  todayDate: Date = new Date();
  type: any;
  adminDetails: any;
  userStakeList: any;
  total: any;
  Id: any;
  event_id: any;
  a: any = [];
  userPlList: any = [];
  parentId: any;
  userName: any;
  constructor(private http: HttpClient, private sport: SportService, private router: Router,
    private cdr: ChangeDetectorRef,
    private modalService: BsModalService, private locationBack: Location, private reportService: ReportService, private toastr: ToastrService) { }
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
  searchUser: string;
  selectedData: any;
commissionValue:string;
  ngOnInit(): void {
    this.adminDetails = JSON.parse(localStorage.getItem('adminDetails'));
    this.type = this.adminDetails.user_type_id;
    this.todayDateTime.setHours(23, 59, 59);
    this.startdateTime.setHours(0, 0, 0, 0);
    this.enddateTime.setHours(23, 59, 59);
    this.startAt.setHours(23, 59, 59);
    var dataTableLengthMenu = [500];
    // this.sportsPl('','filterBtnClick');
    const that = this;
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 500,
      searching: true,
      paging: true,
      serverSide: true,
      processing: true,
      lengthMenu: dataTableLengthMenu,

      ajax: (dataTablesParameters1: any, callback) => {
        let dataTablesParameters = {
          // if (that.statementStartDate) {
          "user_id": this.adminDetails.user_id,
          "from_date": this.startdateTime.toISOString(),
          "to_date": this.enddateTime.toISOString()
          // "from_date": "2022-07-31T18:30:00.000Z",
          // "to_date": "2022-09-05T18:29:59.692Z",
        }
        if (dataTablesParameters.user_id == undefined) {
          delete dataTablesParameters.user_id
        }

        // dataTablesParameters1.search.value != "" ? dataTablesParameters["search"] = (dataTablesParameters1.search.value) : ""
        // that.http.post<DataTablesResponse>('https://angular-datatables-demo-server.herokuapp.com/',dataTablesParameters, {})
        that.http.post<DataTablesResponse>(this.Base_Url + 'fancy/fancyTotalStakeUsersWise', dataTablesParameters, { headers: this.reqHeader })
          .subscribe(resp => {
            if (resp["status"]) {
              this.userPlList = resp.data;
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
          title: 'Agent Name',
          data: 'user_name'
        },
        {
          title: 'Turn Over',
          data: 'stack',
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
        },
        {
          title: 'Action',
          "render": function (data, type, row) {
            var content = ''
            content = content + "<button class='btn btn-primary btn-sm'><a class='text-white' data-toggle='modal' data-target='#settle_confirmation'>Settle</a></button>"
            content = content + "<button class='btn btn-danger btn-sm ml-2'><a class='text-white' data-toggle='modal' data-target='#reject_confirmation' >Reject</a></button>"
            return content;
          }
        }],
      rowCallback: (row: Node, data: any[] | Object, index: number) => {
        const self = this;
        $(row).addClass('text-center');
        return row;
      }
    };
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


  dateSelectionDone() {
    this.isDateVisible = true;
  }
  onCalculate(percentage: number) {
  
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      
      const data = dtInstance.rows().data();
      data.each(function (row) {
        if(row && row.commission != null && row.stack != null){
          row.commission = (row.stack * percentage) / 100
        }
       
      });
      data.rows().invalidate()

  
    });
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
    } else {
      this.currentPage = 1
    }
    // if(this.openBetFilter == false){
    // this.openBets('filterBtnClick');
    // } else {
    //   this.getOpenBetFilterData(this.filterParam[0], this.filterParam[1], this.filterParam[2],'','filterBtnClick')
    // }

  }
  filter(from?: string) {
    this.sportsPl('', 'filterBtnClick');
    // if(this.matchType == 0){
    //   this.openBets('filterBtnClick')
    // } else {
    //   this.settledBets('filterBtnClick')
    // }
  }

  sportsPl(id, from?: string) {
    this.Id = id;
    let data = {
      "user_id": id == '' ? this.adminDetails.user_id : id
    };
    if (from == 'filterBtnClick') {
      if (this.startdateTime) {
        data["from_date"] = this.startdateTime.toISOString()
      }
      if (this.enddateTime) {
        data["to_date"] = this.enddateTime.toISOString()
      }
    }
    this.a = []
    this.reportService.fancyTotalStakeUser(data).subscribe((res) => {
      if (res.status == true) {
        this.userPlList = res.data;
        this.parentId = res.parent_id;
        this.userName = res.user_name;
        this.total = this.userPlList.reduce(
          (a: number, b) => a + b.stack, 0);
      } else {
        this.userPlList = []
      }
    })
  }
  trackByFn(index: any, item: any) {
    return index;
  }

  openModalSettleConfirmation(settle_confirmation: TemplateRef<any>, profit: any) {
    this.selectedData = profit;
    this.modalRef = this.modalService.show(
      settle_confirmation,
      Object.assign({}, { class: '' })
    );
  }

  openModalRejectConfirmation(reject_confirmation: TemplateRef<any>, profit: any) {
    this.selectedData = profit;
    this.modalRef = this.modalService.show(
      reject_confirmation,
      Object.assign({}, { class: '' })
    );
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
  omit_special_char(value,input) {
    let numberPattern = /^\d*\.?\d*$/;
    if(value.trim() !== ''){
      
      if(!value.match(numberPattern)){
    
        const finalValue =  input.value.substr(0,(input.value.length - 1));
        input.value = finalValue

      } 
      if(parseInt(value) > 100){
        input.value = 100
      } if(parseInt(value) < 0){
        input.value = 0
      }
    }
  }
}
