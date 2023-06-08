import { Component, OnInit, ViewChild } from '@angular/core';
import { DateTime } from '../../dateTime';
import { Router } from '@angular/router';
import { PopoverDirective } from 'ngx-bootstrap/popover';
import { Location } from '@angular/common';
import { ReportService } from '../services/report.service';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-fancy-pl',
  templateUrl: './fancy-pl.component.html',
  styleUrls: ['./fancy-pl.component.scss']
})
export class FancyPLComponent implements OnInit {
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {
    "lengthChange": false,
    "ordering": false,
    "paging": false,
    "searching": false
  };
  dtTrigger: Subject<any> = new Subject();
  moment: any = moment;
  todayDate: Date = new Date()
  profitData: any;
  pl: any;
  commission: any;
  netPl: any;
  userData: any;
  filterParam: any = [];
  profitDataFilter: boolean = false;
  constructor(private router: Router, public datepipe: DatePipe, private locationBack: Location, private report: ReportService, private toastr: ToastrService) { }
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
  itemsPerPage: number = 50;
  currentPage: number = 1;
  totalItems: number = 0;
  // openStartDate: Date = new Date()
  // openEndDate: Date = new Date()
  // startAt: Date = new Date()
  param: any;
  ngOnInit(): void {
    this.startdateTime.setHours(0, 0, 0, 0);
    this.enddateTime.setHours(23, 59, 59);
    this.todayDateTime.setHours(23, 59, 59);
    this.profitLossData('filterBtnClick');
    this.getSportList()
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
    if(this.profitDataFilter == false){
      this.profitLossData('filterBtnClick')
    } else {
      this.getProfitLossFilterData(this.filterParam[0], this.filterParam[1], this.filterParam[2],'filterBtnClick')
    }
   
  }

  profitLossData(from?: string) {
    this.userData = JSON.parse(localStorage.getItem('adminDetails'))
    let data = {
      // user_id: this.userData.user_id,// OPTIONAL,
      limit: this.itemsPerPage, // OPTIONAL min 50 max 1000,
      page: this.currentPage, // OPTIONAL,
      search: {
        //  sport_name: ,// OPTIONAL,
        //  series_name: ,// OPTIONAL,
        //  match_name: ,// OPTIONAL,
        //  match_date: ,// OPTIONAL,
        //  event_id: ,// OPTIONAL,
        //  event_name: ,// OPTIONAL,
         type: 2, // OPTIONAL (1,2) 1=Market, 2=Fancy,
        //  from_date :this.openStartDate.toISOString() ,// OPTIONAL TZ forma,t,
        //  to_date: this.openEndDate.toISOString()// OPTIONAL TZ format,
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
    this.report.profitLoss(data).subscribe((res) => {
      if (res.status == true) {
        this.toastr.success("Success", '', {
          positionClass: 'toast-bottom-right',
          timeOut: 1000
        });
        this.profitData = res.data.data;
        this.profitData = this.profitData.sort((a, b) => <any>new Date(b.result_date) - <any>new Date(a.result_date));
        this.pl = this.profitData.reduce(
          (a: number, b) => a + b.p_l, 0);
        this.commission = this.profitData.reduce(
          (a: number, b) => a + b.commission, 0);
        this.netPl = this.profitData.reduce(
          (a: number, b) => a + b.net_pl, 0);
          this.profitDataFilter = false;
        // this.dtTrigger.next();
        if(res.data.metadata[0]){
          this.totalItems = res.data.metadata[0].total
          this.currentPage = res.data.metadata[0].page
        }
       
      } else {
        this.profitData =[]
        this.toastr.error(res.msg, '', {
          timeOut: 10000,
        })
      }
    })
  }
  getSportList() {
    let data = {
      type: "eventsProfitLoss",
      search: {
        type: 2
      }
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

  getProfitLossFilterData(type, id, name,from?: string) {
    let data;
    this.filterParam = [type,id,name];
    if (type == 1) {

      this.param = {
        limit: this.itemsPerPage, 
        page: this.currentPage,
        "search": {
          //"series_id": id,
          "series_name": name,
          type : 2
        }
      }
      data = {
        "search": {
          "series_id": id,
          type : 2

        }
      }
     // this.searchSeries = name
     if(this.searchSport){
      this.param.search['sport_name']=this.searchSport.sport_name
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
          type : 2
        }
      }
      data = {
        "search": {
          "match_id": id,
          type : 2

        }
      }
      if(this.searchSport){
        this.param.search['sport_name']=this.searchSport.sport_name
      }
      if(this.searchSeries){
        this.param.search['series_name']=this.searchSeries.series_name
      }
      //this.searchMatch = name
      this.searchMarket = undefined
    } else if (type == 4) {
      this.param = {
        limit: this.itemsPerPage, 
        page: this.currentPage,
        "search": {
          // "event_name": searchData,
          "event_id": id,
          "type": 2
        }
      }
      data = {
        "search": {
          "event_id": id,
          "type": 2
        }
      }
      if(this.searchSport){
        this.param.search['sport_name']=this.searchSport.sport_name
      }
      if(this.searchSeries){
        this.param.search['series_name']=this.searchSeries.series_name
      }
      if(this.searchMatch){
        this.param.search['match_name']=this.searchMatch.match_name
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
    if(this.param.search.series_name == null){
      delete this.param.search.series_name
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
        if(this.profitData.length == 0 && res.data.metadata[0].total != 0){
          this.currentPage = 1;
          this.getProfitLossFilterData(type, id, name,'filterBtnClick');
        }
        this.profitData = this.profitData.sort((a, b) => <any>new Date(b.result_date) - <any>new Date(a.result_date));
        this.pl = this.profitData.reduce(
          (a: number, b) => a + b.p_l, 0);
        this.commission = this.profitData.reduce(
          (a: number, b) => a + b.commission, 0);
        this.netPl = this.profitData.reduce(
          (a: number, b) => a + b.net_pl, 0);
          this.profitDataFilter = true;
        // this.dtTrigger.next();
        if(res.data.metadata[0]){
          this.totalItems = res.data.metadata[0].total
          this.currentPage = res.data.metadata[0].page
        }
      } else {
        this.profitData=[]
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

  clear(){
    this.time = void 0;
    this.date = void 0;
    this.startdateTime = void 0;
    this.enddateTime = void 0;
  }

  onClickClearBtn() {
    this.searchSport = null
    this.searchMatch = null
    this.searchMarket = null
    this.searchSeries = null
    this.param = null
    this.profitLossData()
    this.SportList = this.initialSportList.sports;
    this.SeriesList = this.initialSportList.series;
    this.MatchList = this.initialSportList.matches;
    this.MarketList = this.initialSportList.events_m_f;
    this.startdateTime=new Date()
    this.enddateTime=new Date()
    this.startdateTime.setHours(0, 0, 0, 0);
    this.enddateTime.setHours(23, 59, 59);
   
  }

  goToViewBets(profit) {
    this.router.navigate(['viewBet/' + profit.match_id + '/' + profit.event_id + '/' + profit.type + '/' + profit.sport_name + '/' + profit.series_name + '/' + profit.match_name])
  }

  goToSportsPl(profit) {
    this.router.navigate(['sport-pl/' + profit.event_id + '/' + profit.type + '/' + profit.match_id + '/' + profit.sport_name + '/' + profit.series_name + '/' + profit.match_name + '/' + profit.event_name])
  }
}
