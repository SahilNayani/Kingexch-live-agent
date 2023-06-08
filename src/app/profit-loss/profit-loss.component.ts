import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { DateTime } from '../../dateTime';
import { Router, ActivatedRoute } from '@angular/router';
import { PopoverDirective } from 'ngx-bootstrap/popover';
import { Location } from '@angular/common';
import { ReportService } from '../services/report.service';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { DatePipe } from '@angular/common';
import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
}
@Component({
  selector: 'app-profit-loss',
  templateUrl: './profit-loss.component.html',
  styleUrls: ['./profit-loss.component.scss']
})
export class ProfitLossComponent implements AfterViewInit, OnDestroy, OnInit {
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  userData: any;
  profitData: any = [];
  pl: any;
  commission: any;
  netPl: any;
  moment: any = moment;
  todayDate: Date = new Date()
  itemsPerPage: number = 50;
  currentPage: number = 1;
  totalItems: number = 0;
  filterParam: any = [];
  profitDataFilter: boolean = false;
  update_user_id: any;
  update_user_Type_id: any;
  adminDetails: any;
  public Base_Url = environment['adminServerUrl'];
  public token = localStorage.getItem('adminAccessToken');
  reqHeader = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ` + this.token
  });
  sportPlList: any[];
  profitloss: any;
  fromDate: string;
  toDate: string;
  downlineprofitloss: any;
  constructor(private http: HttpClient, private route: ActivatedRoute, private router: Router, public datepipe: DatePipe, private locationBack: Location, private report: ReportService, private toastr: ToastrService) {
    this.route.params.subscribe(params => {
      this.update_user_id = params.userId;
      this.update_user_Type_id = params.userTypeId;
    });
  }

  // dateTimePicker 
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
  minTime: Date = new Date()
  maxTime: Date = new Date()
  searchMatch: any
  searchUser: any
  searchMarket: any
  searchSport: any
  searchSeries: any
  initialSportList: any
  SportList: any;
  SeriesList: any;
  MatchList: any;
  todayDateTime: Date = new Date()
  userlist: any = [
    { "user_name": "user1" },
    { "user_name": "user2" },
    { "user_name": "user3" },
    { "user_name": "user4" },
    { "user_name": "user5" },
  ]
  MarketList: any;
  // openStartDate: Date = new Date()
  // openEndDate: Date = new Date()
  // startAt: Date = new Date()
  param: any;
  ngOnInit() {
    this.adminDetails = JSON.parse(localStorage.getItem('adminDetails'));
    this.todayDateTime.setHours(23, 59, 59);
    this.startdateTime.setHours(0, 0, 0, 0);
    this.enddateTime.setHours(23, 59, 59);
    // this.profitLossData('filterBtnClick');
    this.getSportList();
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
            user_id : this.update_user_id,
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
              if(this.update_user_id == undefined){
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
                    this.sportPlList[i].profitloss = (this.sportPlList[i].total + this.sportPlList[i].commission)
                  } else {
                    this.sportPlList[i].profitloss = (this.sportPlList[i].total + this.sportPlList[i].commission)
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
          title: 'Profit/Loss', 
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
        },
        {
          title: 'Total P&L',
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
    this.startAt.setHours(23, 59, 59);
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
    if (this.startdateTime) {
      this.time = this.date = this.startdateTime;
      return;
    }
    if (this.enddateTime) {
      this.time = this.date = this.enddateTime;
      return;
    }
    // this.date = this.time = new Date();

  }
    eventWisePl(data){
      if(this.update_user_id == undefined){
        let a = this.Base_Url.split('api/v1/');
        // let b = 'http://192.168.0.8:4100/' + 'plMatchUserwise/' + data.sport_id + '/'+ data.sport_name + '/'+ this.fromDate + '/'+ this.toDate + '/' + data.type;
        let b = a[0] + 'plMatchUserwise/' + data.sport_id + '/'+ data.sport_name + '/'+ this.fromDate + '/'+ this.toDate + '/' + data.type;
        window.open(b, '_blank', 'location=yes,height=570,width=520,scrollbars=yes,status=yes');
      } else {
        let a = this.Base_Url.split('api/v1/');
      // let b = 'http://192.168.0.8:4100/' + 'plMatchUserwise/' + data.sport_id + '/'+ data.sport_name + '/'+ this.fromDate + '/'+ this.toDate + '/' + this.update_user_id + '/' + data.type;
      let b = a[0] + 'plMatchUserwise/' + data.sport_id + '/'+ data.sport_name + '/'+ this.fromDate + '/'+ this.toDate + '/' + this.update_user_id + '/' + data.type;
      window.open(b, '_blank', 'location=yes,height=570,width=520,scrollbars=yes,status=yes');
      }
      
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
  clear() {
    //https://valor-software.com/ngx-bootstrap/#/timepicker#dynamic
    //Check component DemoTimepickerDynamicComponent  -> clear() method;  void 0 evaluates to undefined
    this.time = void 0;
    this.date = void 0;
    this.startdateTime = void 0;
    this.enddateTime = void 0;
  }

  profitLossData(from?: string) {
    this.userData = JSON.parse(localStorage.getItem('adminDetails'))
    let data = {
      // user_id: this.userData.user_id,// OPTIONAL,
      limit: this.itemsPerPage, // OPTIONAL min 50 max 1000,
      page: this.currentPage, // OPTIONAL,
      search: {
        user_id: this.update_user_id == this.userData.user_id ? '' : this.update_user_id
      }
    };
    if (data.search.user_id == '') {
      delete data.search.user_id
    }
    if (from == 'filterBtnClick') {
      if (this.startdateTime) {
        data["from_date"] = this.startdateTime.toISOString()
      }
      if (this.enddateTime) {
        data["to_date"] = this.enddateTime.toISOString()
      }
    }
    this.report.profitLoss(data).subscribe((res) => {
      if (res.status == true) {
        this.toastr.success("Success", '', {
          positionClass: 'toast-bottom-right',
          timeOut: 1000
        });
        this.profitData = res.data.data;
        this.profitData = this.profitData.sort((a, b) => <any>new Date(b.result_date) - <any>new Date(a.result_date));
        this.pl = this.profitData.reduce(
          (a: number, b) => a + b.p_l_full, 0);
        this.commission = this.profitData.reduce(
          (a: number, b) => a + b.commission_full, 0);
        this.netPl = this.profitData.reduce(
          (a: number, b) => a + b.net_pl_full, 0);
        this.profitDataFilter = false;
        // this.dtTrigger.next();
        if (res.data.metadata[0]) {
          this.totalItems = res.data.metadata[0].total
          this.currentPage = res.data.metadata[0].page
        }

      } else {
        this.profitData = []
        this.toastr.error(res.msg, '', {
          timeOut: 10000,
        })
      }
    })
  }

  goToViewBets(profit) {
    this.router.navigate(['viewBet/' + profit.match_id + '/' + profit.event_id + '/' + profit.type + '/' + profit.sport_name + '/' + profit.series_name + '/' + profit.match_name])
  }

  goToSportsPl(profit) {
    this.router.navigate(['sport-pl/' + profit.event_id + '/' + profit.type + '/' + profit.match_id + '/' + profit.sport_name + '/' + profit.series_name + '/' + profit.match_name + '/' + profit.event_name])
  }
  pageChange(event?: any) {
    if (event) {
      this.currentPage = event
    } else {
      this.currentPage = 1
    }
    if (this.profitDataFilter == false) {
      this.profitLossData('filterBtnClick')
    } else {
      this.getProfitLossFilterData(this.filterParam[0], this.filterParam[1], this.filterParam[2], 'filterBtnClick')
    }
  }

  getSportList() {
    let data = {
      type: "eventsProfitLoss",
      search: {}
    };
    this.report.eventList(data).subscribe((res) => {
      if (res.status == true) {
        this.initialSportList = res.data[0]
        this.SportList = res.data[0].sports;
        this.SeriesList = res.data[0].series;
        this.MatchList = res.data[0].matches;
        this.MarketList = res.data[0].events_m_f;
      }
    })
  }

  getProfitLossFilterData(type, id, name, from?: string) {
    let data;
    this.filterParam = [type, id, name];
    if (type == 0) {

      this.param = {
        limit: this.itemsPerPage,
        page: this.currentPage,
        "search": {
          //"sport_id": id
          "sport_name": name,
          user_id: this.update_user_id == this.userData.user_id ? '' : this.update_user_id
        }
      }
      data = {
        "search": {
          "sport_id": id

        }
      }
      //this.searchSport = name

      this.searchMatch = undefined
      this.searchMarket = undefined
      this.searchSeries = undefined
    } else if (type == 1) {

      this.param = {
        limit: this.itemsPerPage,
        page: this.currentPage,
        "search": {
          //"series_id": id,
          "series_name": name,
          user_id: this.update_user_id == this.userData.user_id ? '' : this.update_user_id
        }
      }
      data = {
        "search": {
          "series_id": id

        }
      }
      // this.searchSeries = name
      if (this.searchSport) {
        this.param.search['sport_name'] = this.searchSport.sport_name
      }
      this.searchMatch = undefined
      this.searchMarket = undefined

    } else if (type == 2) {

      this.param = {
        limit: this.itemsPerPage,
        page: this.currentPage,
        "search": {
          // "match_id": id
          "match_name": name,
          user_id: this.update_user_id == this.userData.user_id ? '' : this.update_user_id
        }
      }
      data = {
        "search": {
          "match_id": id

        }
      }
      if (this.searchSport) {
        this.param.search['sport_name'] = this.searchSport.sport_name
      }
      if (this.searchSeries) {
        this.param.search['series_name'] = this.searchSeries.series_name
      }
      //this.searchMatch = name
      this.searchMarket = undefined
    } else if (type == 3) {

      this.param = {
        limit: this.itemsPerPage,
        page: this.currentPage,
        "search": {
          // "event_name": searchData,
          "event_id": id,
          "type": 1,
          user_id: this.update_user_id == this.userData.user_id ? '' : this.update_user_id
        }

      }
      data = {
        "search": {
          "event_id": id,
          "type": 1
        }
      }
      //this.searchMarket = name
      if (this.searchSport) {
        this.param.search['sport_name'] = this.searchSport.sport_name
      }
      if (this.searchSeries) {
        this.param.search['series_name'] = this.searchSeries.series_name
      }
      if (this.searchMatch) {
        this.param.search['match_name'] = this.searchMatch.match_name
      }
    } else if (type == 4) {
      this.param = {
        limit: this.itemsPerPage,
        page: this.currentPage,
        "search": {
          // "event_name": searchData,
          "event_id": id,
          "type": 2,
          user_id: this.update_user_id == this.userData.user_id ? '' : this.update_user_id
        }
      }
      data = {
        "search": {
          "event_id": id,
          "type": 2
        }
      }
      if (this.searchSport) {
        this.param.search['sport_name'] = this.searchSport.sport_name
      }
      if (this.searchSeries) {
        this.param.search['series_name'] = this.searchSeries.series_name
      }
      if (this.searchMatch) {
        this.param.search['match_name'] = this.searchMatch.match_name
      }
      //this.searchMarket = name
    }
    if (from == 'filterBtnClick') {
      if (this.startdateTime) {
        this.param["from_date"] = this.startdateTime.toISOString()
      }
      if (this.enddateTime) {
        this.param["to_date"] = this.enddateTime.toISOString()
      }
    }
    if (this.param.search.user_id == '') {
      delete this.param.search.user_id
    }
    // this.param["page"] = 1
    // this.param["limit"] = this.itemsPerPage
    this.filterSearchDropdownValues(data.search, type)
    this.report.profitLoss(this.param).subscribe((res) => {
      if (res.status) {
        this.toastr.success("Success", '', {
          positionClass: 'toast-bottom-right',
          timeOut: 1000
        });

        this.profitData = res.data.data;
        this.profitData = this.profitData.sort((a, b) => <any>new Date(b.result_date) - <any>new Date(a.result_date));
        if (this.profitData.length == 0 && res.data.metadata[0].total != 0) {
          this.currentPage = 1;
          this.getProfitLossFilterData(type, id, name, 'filterBtnClick');
        }
        this.pl = this.profitData.reduce(
          (a: number, b) => a + b.p_l_full, 0);
        this.commission = this.profitData.reduce(
          (a: number, b) => a + b.commission_full, 0);
        this.netPl = this.profitData.reduce(
          (a: number, b) => a + b.net_pl_full, 0);
        this.profitDataFilter = true;
        // this.dtTrigger.next();
        if (res.data.metadata[0]) {
          this.totalItems = res.data.metadata[0].total
          this.currentPage = res.data.metadata[0].page
        }

      } else {
        this.profitData = []
        this.toastr.error(res.msg)
      }
    })

  }

  filterSearchDropdownValues(search, type) {
    let listParams = {
      type: "eventsProfitLoss",
      search: search
    }
    this.report.eventList(listParams).subscribe((res) => {
      if (res.status == true) {
        if (type == 0) {
          this.SeriesList = res.data[0].series;
          this.MatchList = res.data[0].matches;
          this.MarketList = res.data[0].events_m_f;
        } else if (type == 1) {
          this.MatchList = res.data[0].matches;
          this.MarketList = res.data[0].events_m_f;
        } else if (type == 2) {
          this.MarketList = res.data[0].events_m_f;
        }

      }
    })
  }


  onClickClearBtn() {
    this.searchSport = null
    this.searchMatch = null
    this.searchMarket = null
    this.searchSeries = null
    this.param = null
    this.profitLossData('filterBtnClick')
    this.SportList = this.initialSportList.sports;
    this.SeriesList = this.initialSportList.series;
    this.MatchList = this.initialSportList.matches;
    this.MarketList = this.initialSportList.events_m_f;
    this.startdateTime = new Date()
    this.enddateTime = new Date()
    this.startdateTime.setHours(0, 0, 0, 0);
    this.enddateTime.setHours(23, 59, 59);

  }
  statement(id, type) {
    this.router.navigate(['statement/' + id + '/' + type])
  }
  account(id, type) {
    this.router.navigate(['account-info/' + id + '/' + type])
  }
  openBet(id, type) {
    this.router.navigate(['open-bet/' + id + '/' + type])
  }
  proloss(id, type) {
    this.router.navigate(['profit-loss/' + id + '/' + type])
  }
  onlineUser(id, type) {
    this.router.navigate(['online-user/' + id + '/' + type])
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
