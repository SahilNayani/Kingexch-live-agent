
import { Component, OnInit, ViewChild, TemplateRef, AfterViewInit,OnDestroy } from '@angular/core';
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
import { HttpClient, HttpResponse,HttpHeaders } from '@angular/common/http';
import { Subject } from 'rxjs';
import { environment } from '../../environments/environment';
class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
}
@Component({
  selector: 'app-settled-bets',
  templateUrl: './settled-bets.component.html',
  styleUrls: ['./settled-bets.component.scss']
})
export class SettledBetsComponent implements AfterViewInit,OnDestroy,OnInit {
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  modalRef: BsModalRef;
  public Base_Url = environment['adminServerUrl'];
  userData: any;
  settledBetData: any = [];
  pl: any;
  commission: any;
  netPl: any;
  moment: any = moment;
  todayDate: Date = new Date()
  SportList: any;
  SeriesList: any;
  MatchList: any;
  userlist: any = [
    { "user_name": "user1" },
    { "user_name": "user2" },
    { "user_name": "user3" },
    { "user_name": "user4" },
    { "user_name": "user5" },
  ]
  MarketList: any;
  betType: any = 0;
  param: any;
  initialSportList: any;
  userParentName: any;
  parentList: any;
  adminDetails: any;
  type: any;
  filterParam: any = [];
  settleBetFilter: boolean = false;
  matchType: any = "unsettle";
  sportData: any;
  public token = localStorage.getItem('adminAccessToken');
  reqHeader = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ` + this.token
  });
  constructor(private http: HttpClient,private sport: SportService, private router: Router, private modalService: BsModalService, private locationBack: Location, private reportService: ReportService, private toastr: ToastrService) { }

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
  itemsPerPage: number = 50;
  currentPage: number = 1;
  totalItems: number = 0;
  settledStartDate: Date = new Date()
  settledEndDate: Date = new Date()
  startAt: Date = new Date()
  todayDateTime: Date = new Date()
  ngOnInit() {
    this.adminDetails = JSON.parse(localStorage.getItem('adminDetails'));
    this.type = this.adminDetails.user_type_id;
    this.startdateTime.setHours(0, 0, 0, 0);
    this.enddateTime.setHours(23, 59, 59);
    this.getSportList()
    // this.startAt.setHours(23, 59, 59);
    // this.openBets('filterBtnClick');
    const that = this;
      this.dtOptions = {
        pagingType: 'full_numbers',
        pageLength: 50,
        searching: false, 
        paging:true,
        serverSide: true,
        processing: true,
        ajax: (dataTablesParameters1: any, callback) => {
          let dataTablesParameters = {
            "from_date": this.startdateTime.toISOString(),
            "to_date": this.enddateTime.toISOString(),
          //   "from_date": "2022-07-31T18:30:00.000Z",
          // "to_date": "2022-09-05T18:29:59.692Z",
            page: (dataTablesParameters1.start/ dataTablesParameters1.length)+1,
            limit: dataTablesParameters1.length,
            type: this.matchType,
            "search": {
              "sport_id": this.sportData
            },
          }
          // if(dataTablesParameters.search.sport_id == undefined){
          //   delete dataTablesParameters.search.sport_id;
          //   // delete data.search
          // }
          // that.http.post<DataTablesResponse>('https://angular-datatables-demo-server.herokuapp.com/',dataTablesParameters, {})
          console.log("127",dataTablesParameters);
          
          that.http.post<DataTablesResponse>(this.Base_Url + 'bet/getMasterBetList', dataTablesParameters, { headers: this.reqHeader })
          .subscribe(resp => {
            if (resp["status"]) {
                this.settledBetData = resp.data["data"];
                this.settleBetFilter = false;
                for(let i = 0;i<this.settledBetData.length;i++){
                  this.settledBetData[i].updateDateTime = moment(this.settledBetData[i].createdAt).utcOffset("+5:30").format('DD-MM-YYYY HH:mm:ss');
                  this.settledBetData[i].updateType = this.settledBetData[i].is_back == 1 ? 'Back'  : 'Lay';
                  if(this.settledBetData[i].is_fancy == 0) {
                    this.settledBetData[i].updateOdds = this.settledBetData[i].odds;
                  } else {
                    this.settledBetData[i].updateOdds = this.settledBetData[i].odds + '/' + this.settledBetData[i].size;
                  }
                }
                this.totalItems = resp.data["metadata"][0].total
                this.currentPage = resp.data["metadata"][0].page
                callback({
                  recordsTotal: resp.data["metadata"][0].total,
                  recordsFiltered: resp.data["metadata"][0].total,
                  data: this.settledBetData
                });
              
            } else {
                this.toastr.error(resp["msg"]);
                this.settledBetData = []
                callback({
                  recordsTotal: 0,
                  recordsFiltered: 0,
                  data: this.settledBetData
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
            title: 'Sport Name',
            data: 'sport_name'
          },
          {
            title: 'Event Name',
            data: 'match_name'
          },
          {
            title: 'Market Name',
            data: 'market_name'
          },
          {
            title: 'Selection',
            data: 'selection_name'
          },
          {
            title: 'Type',
            data: 'updateType',
            "render": function (data, type, row) {
              var content = ''
              if(row.updateType == "Lay"){
                  content = content + '<span class="text-center text-danger" style="font-weight : 600 ">' + row.updateType + '</span>';
                } else  {
                  content = content + '<span class="text-center text-success" style="font-weight : 600 ">' + row.updateType + '</span>';
                } 
                return content;
              }
          },
          {
            title: 'Odds Req.',
            data: 'updateOdds'
          },
          {
            title: 'Stake',
            data: 'stack',
            "render": function (data, type, row) {
              var content = ''
                  content = content + '<span  style="font-weight : 600 ">' + row.stack + '</span>';
                 
                return content;
              }
          },
          {
            title: 'Placed Time',
            data: 'updateDateTime'
          },
        ],
        rowCallback :(row: Node, data: any[] | Object, index: number) => {
          const self = this;
          $( row ).addClass('text-center');
          return row; 
        }
      };
    this.todayDateTime.setHours(23, 59, 59);
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

  settledBets(from?: string) {
    let data = {
      page: this.currentPage,
      limit: this.itemsPerPage
    }
    if (from == 'filterBtnClick') {
      data['search'] = {}
      if (this.startdateTime) {
        data["from_date"] = this.startdateTime.toISOString()
      }
      if (this.enddateTime) {
        data["to_date"] = this.enddateTime.toISOString()
      }
    }
    this.reportService.settleBets(data).subscribe((res) => {
      if (res.status) {
        this.toastr.success("Success", '', {
          positionClass: 'toast-bottom-right',
          timeOut: 1000
        });
        this.settledBetData = res.data.data;
        console.log(this.settledBetData, "this.settledBetData")
        this.settleBetFilter = false;
        this.totalItems = res.data.metadata[0].total
        this.currentPage = res.data.metadata[0].page
      } else {
        this.toastr.error(res.msg)
        this.settledBetData = []
      }
    })
  }
  openBets(from?: string) {
    let data = {
      page: this.currentPage,
      limit: this.itemsPerPage,
    }
    
    if (from == 'filterBtnClick') {
      // data['search']={}
      // data['search'] = data.search == undefined ? {} : this.param.search
      if(this.startdateTime){
       data["from_date"]= this.startdateTime.toISOString()
      }
      if(this.enddateTime){
        data["to_date"]=this.enddateTime.toISOString()
      }
    }
    this.reportService.openBets(data).subscribe((res) => {
      if (res.status) {
        this.toastr.success("Success", '', {
          positionClass: 'toast-bottom-right',
          timeOut: 1000
        });
        this.settledBetData = res.data.data;
        this.settleBetFilter = false;
        this.totalItems = res.data.metadata[0].total
        this.currentPage = res.data.metadata[0].page
      } else {
        this.toastr.error(res.msg)
        this.settledBetData=[]
      }
    })


  }
  filter(from?: string){
    if(this.matchType == 0){
      this.openBets('filterBtnClick')
    } else {
      this.settledBets('filterBtnClick')
    }
  }
  selectMatchType(){
    this.matchType = this.betType
    this.getSportList();
    this.rerender();
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
    if(this.matchType == 0){
      this.openBets('filterBtnClick')
    } else {
      this.settledBets('filterBtnClick')
    }
  }

  getSportList() {
    let data = {
      type: this.matchType != "unsettle" ?  'settledBets' : 'openBets',
      search: {}
    };
    this.reportService.eventList(data).subscribe((res) => {
      if (res.status == true) {
        this.initialSportList = res.data[0]
        this.SportList = res.data[0].sports;
        this.SeriesList = res.data[0].series;
        this.MatchList = res.data[0].matches;
        this.MarketList = res.data[0].events_m_f;
      }
    })
  }
  getFilterData(data){
    this.sportData = data;
    this.rerender();
    // this.rollCommission('filterBtnClick');
  }
  getSettledBetFilterData(type, id, name ,from?: string,date?: string) {
    this.filterParam = [type, id, name];
    if(from == '1'){
      if (type == 0) {
        this.param = {
          limit: this.itemsPerPage,
          page: 1,
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
          page: 1,
          "search": {
            "series_id": id,
          }
        }
        //  this.searchSeries = name
        this.searchMatch = undefined
        this.searchMarket = undefined
        if (this.searchSport) {
          this.param.search['sport_id'] = this.searchSport.sport_id
        }
      } else if (type == 2) {
        this.param = {
          limit: this.itemsPerPage,
          page: 1,
          "search": {
            "match_id": id
          }
        }
        //this.searchMatch = name
        this.searchMarket = undefined
        if (this.searchSport) {
          this.param.search['sport_id'] = this.searchSport.sport_id
        }
        if (this.searchSeries) {
          this.param.search['series_id'] = this.searchSeries.series_id
        }
      } else if (type == 3) {
        this.param = {
          limit: this.itemsPerPage,
          page: 1,
          "search": {
            // "event_name": searchData,
            "market_id": id,
            //"type": 1
          }
        }
        //this.searchMarket = name
        if (this.searchSport) {
          this.param.search['sport_id'] = this.searchSport.sport_id
        }
        if (this.searchSeries) {
          this.param.search['series_id'] = this.searchSeries.series_id
        }
        if (this.searchMatch) {
          this.param.search['match_id'] = this.searchMatch.match_id
        }
      } else if (type == 4) {
        this.param = {
          limit: this.itemsPerPage,
          page: 1,
          "search": {
            // "event_name": searchData,
            "fancy_id": id,
            //"type": 2
          }
        }
        //this.searchMarket = name
        if (this.searchSport) {
          this.param.search['sport_id'] = this.searchSport.sport_id
        }
        if (this.searchSeries) {
          this.param.search['series_id'] = this.searchSeries.series_id
        }
        if (this.searchMatch) {
          this.param.search['match_id'] = this.searchMatch.match_id
        }
      }
    } else{
    if (type == 0) {
      this.param = {
        limit: this.itemsPerPage,
        page: this.currentPage,
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
          "series_id": id,
        }
      }
      //  this.searchSeries = name
      this.searchMatch = undefined
      this.searchMarket = undefined
      if (this.searchSport) {
        this.param.search['sport_id'] = this.searchSport.sport_id
      }
    } else if (type == 2) {
      this.param = {
        limit: this.itemsPerPage,
        page: this.currentPage,
        "search": {
          "match_id": id
        }
      }
      //this.searchMatch = name
      this.searchMarket = undefined
      if (this.searchSport) {
        this.param.search['sport_id'] = this.searchSport.sport_id
      }
      if (this.searchSeries) {
        this.param.search['series_id'] = this.searchSeries.series_id
      }
    } else if (type == 3) {
      this.param = {
        limit: this.itemsPerPage,
        page: this.currentPage,
        "search": {
          // "event_name": searchData,
          "market_id": id,
          //"type": 1
        }
      }
      //this.searchMarket = name
      if (this.searchSport) {
        this.param.search['sport_id'] = this.searchSport.sport_id
      }
      if (this.searchSeries) {
        this.param.search['series_id'] = this.searchSeries.series_id
      }
      if (this.searchMatch) {
        this.param.search['match_id'] = this.searchMatch.match_id
      }
    } else if (type == 4) {
      this.param = {
        limit: this.itemsPerPage,
        page: this.currentPage,
        "search": {
          // "event_name": searchData,
          "fancy_id": id,
          //"type": 2
        }
      }
      //this.searchMarket = name
      if (this.searchSport) {
        this.param.search['sport_id'] = this.searchSport.sport_id
      }
      if (this.searchSeries) {
        this.param.search['series_id'] = this.searchSeries.series_id
      }
      if (this.searchMatch) {
        this.param.search['match_id'] = this.searchMatch.match_id
      }
    }
  }
  if (date == 'filterBtnClick') {
    if (this.startdateTime) {
      this.param["from_date"] = this.startdateTime.toISOString()
    }
    if (this.enddateTime) {
      this.param["to_date"] = this.enddateTime.toISOString()
    }
  }
    // this.param["page"] = 1
    // this.param["limit"] = this.itemsPerPage
    this.filterSearchDropdownValues(this.param.search, type)
    this.reportService.settleBets(this.param).subscribe((res) => {
      if (res.status) {
        this.toastr.success("Success", '', {
          positionClass: 'toast-bottom-right',
          timeOut: 1000
        });
        this.settledBetData = res.data.data;
        if (this.settledBetData.length == 0 && res.data.metadata[0].total != 0) {
          this.currentPage = 1;
          this.getSettledBetFilterData(type, id, name,'','filterBtnClick');
        }
        this.settleBetFilter = true;
        if (res.data.metadata[0]) {
          this.totalItems = res.data.metadata[0].total
          this.currentPage = res.data.metadata[0].page
        }
      } else {
        this.toastr.error(res.msg)
      }
    })

  }

  filterSearchDropdownValues(search, type) {
    let listParams = {
      type: "settledBets",
      search: search
    }
    this.reportService.eventList(listParams).subscribe((res) => {
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

  onClickClear() {
    this.searchSport = undefined
    this.searchMatch = undefined
    this.searchMarket = undefined
    this.searchSeries = undefined
    this.param = undefined
    this.settledBets('filterBtnClick');
    this.SportList = this.initialSportList.sports;
    this.SeriesList = this.initialSportList.series;
    this.MatchList = this.initialSportList.matches;
    this.MarketList = this.initialSportList.events_m_f;
    this.startdateTime = new Date()
    this.enddateTime = new Date()
    this.startdateTime.setHours(0, 0, 0, 0);
    this.enddateTime.setHours(23, 59, 59);
  }

  clear() {
    this.time = void 0;
    this.date = void 0;
    this.startdateTime = void 0;
    this.enddateTime = void 0;
  }

  openModalUserParentList(user, userParentList: TemplateRef<any>) {
    this.modalRef = this.modalService.show(
      userParentList,
      Object.assign({}, { class: '' })
    );
    this.userParentName = user.user_name;
    let data = {
      "user_id": user.user_id
    }
    this.sport.showParentList(data).subscribe((res) => {
      if (res.status == true) {
        this.parentList = res.data.agents;
      } else {
        this.toastr.error(res.msg, '', {
          timeOut: 10000,
        })
      }
    })
  }

  ngAfterViewInit() {
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




