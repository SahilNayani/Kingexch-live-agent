import { Component, OnDestroy, OnInit, ViewChild,TemplateRef } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { DateTime } from '../../dateTime';
import { PopoverDirective } from 'ngx-bootstrap/popover';
import { Location } from '@angular/common';
import { Router,ActivatedRoute } from '@angular/router';
import { SportService } from '../services/sport.service';
import { ToastrService } from 'ngx-toastr';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import * as _moment from 'moment';
import { ReportService } from '../services/report.service';
import { takeUntil } from 'rxjs/operators';
const _ = require("lodash");
@Component({
  selector: 'app-downline-report',
  templateUrl: './downline-report.component.html',
  styleUrls: ['./downline-report.component.scss']
})
export class DownlineReportComponent implements OnInit,OnDestroy {
  // dateTimePicker 
  @ViewChild('popoverRef') private _popoverRef: PopoverDirective;
  // time: Date;
  // date: Date;
  // isDateVisible: boolean = true;
  // isMeridian: boolean = false;
  dateTime = new Date();
  userId:string;
  modalRef: BsModalRef;
  //exposure tab related parameters
  exposureData:any 
  expoLength:any

  //statements tab paramters
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {
    "lengthChange": false,
    "ordering": false,
    "paging": false,
    "searching": false
  };
  dtTrigger: Subject<any> = new Subject();
  statementType: any = [];
  user_id: any;
  update_user_id: any;
  data: any;
  statementList: any=[];
  isSocket;
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
  min: Date = new Date()
  startAt: Date = new Date()
  itemsPerPage: number = 50;
  currentPage: number = 1;
  totalItems:number=0;
  settledBetitemsPerPage: number = 50;
  settledBetcurrentPage: number = 1;
  settledBettotalItems:number=0;
  statementsitemsPerPage: number = 50;
  statementscurrentPage: number = 1;
  statementstotalItems:number=0;
  //open bets
  openBetData:any=[];
  SportList: any;
  SeriesList: any;
  MatchList: any;
  initialSportList: any;
  MarketList: any;
  userlist: any = [
    { "user_name": "user1" },
    { "user_name": "user2" },
    { "user_name": "user3" },
    { "user_name": "user4" },
    { "user_name": "user5" },
  ]
  searchMatch: any
  searchUser: any
  searchMarket: any
  searchSport: any
  searchSeries: any
  betType:any;
  param:any;
  settledBetData:any =[];
  userBalance:any;
  userExposure:any;
  userPL:any;
  hierarchy:any=[]
  //activity parameters
  a: any = [];
  userPlList: any=[];
  gameList: any;
  cricket: any;
  soccer: any;
  tennis: any;
  session: any;
  commission: any;
  total: any;
  userDetails: any;
  userName: any;
  parentId: any;
  Id: any;
  event_id: any;
  type_id: any;
  sport_name: any;
  series_name: any;
  match_name: any;
  match_id: any;
  showBetButton: boolean;
  market_name: any;
  casino: any;
  todayDateTime:Date=new Date()
  expoRouteData: any;
  minTime: Date = new Date()
  maxTime: Date = new Date()
  typeId: any;
  userParentName: any;
  parentList: any;
  adminDetails: any;
  type: any;
  constructor(private locationBack: Location,private toastr: ToastrService,private sport: SportService,
     private activatedRoute:ActivatedRoute,private sportService:SportService,private modalService: BsModalService,
     private reportService:ReportService,private router:Router) {
  this.activatedRoute.params.subscribe(params => {
    this.userId = params.userId;
    this.typeId = params.userTypeId;
  });
}
  ngOnInit() {
    //  this.sportsPl('');
    this.adminDetails = JSON.parse(localStorage.getItem('adminDetails'));
    this.type = this.adminDetails.user_type_id;
    this.hierarchy=  JSON.parse(sessionStorage.getItem("hierarchy"))
    this.activatedRoute.queryParams.subscribe(params => {
      this.userExposure = JSON.parse(params.netExposure)
      this.userBalance = JSON.parse(params.balance)
      this.userPL = JSON.parse(params.profit_loss)
    });
    //statements code 
    this.statementType = {
      '0': 'Statement',
      '1': 'Free Chips',
      '4': 'Settlement',
      '2': 'Profit Loss',
      '3': 'Commission'
    };
    this.startdateTime.setHours(0, 0, 0, 0);
    this.todayDateTime.setHours(23, 59, 59);
    this.enddateTime.setHours(23, 59, 59);
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

  tabClick(tabName){
    if(tabName == 'netExposure'){
      this.getExposureDataByUserId()
    }else if(tabName == 'accountStatements'){
      this.getStatement();
     
    }else if ( tabName == 'betList'){
      this.openBets();
      this.getSportList('openBets');
    }else if( tabName == 'activity'){
      this.sportsPl('');
    }
  }

//exposure tab code 
  getExposureDataByUserId(){
    let data = {
      "user_id": this.userId
    }
    this.sportService.getExposure(data).subscribe((res) => {
      if (res.status == true) {
        this.exposureData = res.data;
        this.expoLength = this.exposureData.length;
        //this.expo_User_name = res.user_name;
      } else {
        this.toastr.error(res.msg, '', {
          timeOut: 10000,
        })
      }


    })
  }

  //account statements code

  getStatement(from?: string) {

    this.data = {
      "statement_type": this.selections,
      "user_id": this.userId,
      "limit": this.statementsitemsPerPage,
      "page": this.statementscurrentPage,
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

    if (this.isSocket != 1) {
      this.reportService.statements(this.data).subscribe(data => {
        if (data.status == true) {
          this.statementList = data.data[0].data;
          if(data.data[0].metadata[0]){
            this.statementstotalItems=data.data[0].metadata[0].total
            this.statementscurrentPage=data.data[0].metadata[0].page
          }
         
        } else {
          this.toastr.error(data.msg, '', {
            timeOut: 10000,
          });
        }
      })
    }
    else {

      // this.socketEmitEvent('account-satement', this.data);

    }

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
    }
    if (!this.endTime) {
      this.endTime = this.endDate;
    }
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

  onClickClear(){
    this.startdateTime = new Date();
    this.enddateTime = new Date()
    this.startdateTime.setHours(0, 0, 0, 0);
    this.enddateTime.setHours(23, 59, 59);
  
    this.getStatement()
  }
  onSelectionChange(data) {
    this.radioSelect
    this.selections = data;
    this.getStatement()

  }

 

  pageChange(event?:any){
    if(event){
      this.currentPage=event
    }else{
      this.currentPage=1
    }
   
    this.openBets()
  }
  settledBetpageChange(event?:any){
    if(event){
      this.settledBetcurrentPage=event
    }else{
      this.settledBetcurrentPage=1
    }
   
    this.settledBets()
  }
  statementspageChange(event?:any){
    if(event){
      this.statementscurrentPage=event
    }else{
      this.statementscurrentPage=1
    }
    
    this.getStatement()
  }
  subTabClick(tabName){
    if(tabName == 'openBet'){
      this.openBets();
      this.getSportList("openBets");
      this.searchSport = undefined
      this.searchMatch = undefined
      this.searchMarket = undefined
      this.searchSeries = undefined
      this.param = undefined
    }else if(tabName == 'settledBet'){
      this.settledBets();
      this.getSportList("settledBets");
      this.searchSport = undefined
      this.searchMatch = undefined
      this.searchMarket = undefined
      this.searchSeries = undefined
      this.param = undefined
    }
  }

  //betlist tab code
  openBets(from?: string) {
    let data = {
      page: this.currentPage,
      limit: this.itemsPerPage,
      search: {
      user_id:this.userId
      }
    }
    if (from == 'filterBtnClick') {
      //data['search']={}
      // data['search'] = data.search == undefined ? {} : this.param.search
      if(this.startdateTime){
       data["from_date"]= this.startdateTime.toISOString()
      }
      if(this.enddateTime){
        data["to_date"]=this.enddateTime.toISOString()
      }
    }
    data['search']['user_id'] =this.userId
    this.reportService.openBets(data).subscribe((res) => {
      if (res.status) {
        this.toastr.success("Success", '', {
          positionClass: 'toast-bottom-right',
          timeOut: 1000
        });
        this.openBetData = res.data.data;
        this.totalItems = res.data.metadata[0].total
        this.currentPage = res.data.metadata[0].page
      } else {
        this.toastr.error(res.msg)
        this.openBetData=[]
      }
    })


  }

  getSportList(type) {
    let data = {
      type: type,
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

  onClickOpenBetClearBtn() {
    this.searchSport = undefined
    this.searchMatch = undefined
    this.searchMarket = undefined
    this.searchSeries = undefined
    this.param = undefined
    this.openBets()
    this.SportList = this.initialSportList.sports;
    this.SeriesList = this.initialSportList.series;
    this.MatchList = this.initialSportList.matches;
    this.MarketList = this.initialSportList.events_m_f;
    this.startdateTime=new Date()
    this.enddateTime=new Date()
    this.startdateTime.setHours(0, 0, 0, 0);
    this.enddateTime.setHours(23, 59, 59);
    
  }

  getOpenBetFilterData(type, id?: any, name?: any) {
    if (type == 0) {
      this.param = {
        "search": {
          "sport_id": id
        }
      }
    //  this.searchSport = name
      this.betType = undefined
      this.searchMatch = undefined
      this.searchMarket = undefined
      this.searchSeries = undefined
    } else if (type == 1) {
      this.param = {
        "search": {
          "series_id": id,
        }
      }
     // this.searchSeries = name
      this.betType = undefined
      this.searchMatch = undefined
      this.searchMarket = undefined
      if(this.searchSport){
        this.param.search['sport_id']=this.searchSport.sport_id
      }
    } else if (type == 2) {
      this.param = {
        "search": {
          "match_id": id
        }
      }
      //this.searchMatch = name
      this.betType = undefined
      this.searchMarket = undefined
      if(this.searchSport){
        this.param.search['sport_id']=this.searchSport.sport_id
      }
      if(this.searchSeries){
        this.param.search['series_id']=this.searchSeries.series_id
      }
    } else if (type == 3) {
      this.param = {
        "search": {
          "market_id": id,
        }
      }
      //this.searchMarket = name
      this.betType = undefined
      if(this.searchSport){
        this.param.search['sport_id']=this.searchSport.sport_id
      }
      if(this.searchSeries){
        this.param.search['series_id']=this.searchSeries.series_id
      }
      if(this.searchMatch){
        this.param.search['match_id']=this.searchMatch.match_id
      }
    } else if (type == 4) {

      this.param = {
        "search": {
          "fancy_id": id,
        }
      }
      //this.searchMarket = name
      this.betType = undefined
      if(this.searchSport){
        this.param.search['sport_id']=this.searchSport.sport_id
      }
      if(this.searchSeries){
        this.param.search['series_id']=this.searchSeries.series_id
      }
      if(this.searchMatch){
        this.param.search['match_id']=this.searchMatch.match_id
      }
    }


    if (type == 'betType') {
      this.searchSport = undefined
      this.searchMatch = undefined
      this.searchMarket = undefined
      this.searchSeries = undefined

      this.param = {
        "search": {
          "is_back": parseInt(this.betType),
        }
      }
      // this.param["search"]["is_back"]=this.betType
    }
    this.param["page"] = 1
    this.param["limit"] = this.itemsPerPage
    this.filterSearchDropdownValues(this.param.search, type,'openBets')
    this.param['search']['user_id'] =this.userId
    this.reportService.openBets(this.param).subscribe((res) => {
      if (res.status) {
        this.toastr.success("Success", '', {
          positionClass: 'toast-bottom-right',
          timeOut: 1000
        });

        this.openBetData = res.data.data;
        this.totalItems = res.data.metadata[0].total
        this.currentPage = res.data.metadata[0].page

      } else {
        this.toastr.error(res.msg)
        this.openBetData=[]
      }
    })

  }

  filterSearchDropdownValues(search, type,from?:string) {
    let listParams = {
      type: from,
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

  settledBets(from?: string) {
    let data = {
      page:this.settledBetcurrentPage,
      limit:this.settledBetitemsPerPage,
      search: {
        user_id:this.userId
        }
    }
    if (from == 'filterBtnClick') {
     
      if (this.startdateTime) {
        data["from_date"] = this.startdateTime.toISOString()
      }
      if (this.enddateTime) {
        data["to_date"] = this.enddateTime.toISOString()
      }
    }
    
      data['search']['user_id'] =this.userId
    this.reportService.settleBets(data).subscribe((res) => {
      if (res.status) {
        this.toastr.success("Success", '', {
          positionClass: 'toast-bottom-right',
          timeOut: 1000
        });
        this.settledBetData = res.data.data;
      if(res.data.metadata[0]){
        this.settledBettotalItems=res.data.metadata[0].total
        this.settledBetcurrentPage= res.data.metadata[0].page
      }
       
      } else {
        this.toastr.error(res.msg)
        this.settledBetData=[]
      }
    })
  }

  getSettledBetFilterData(type, id, name) {
    if (type == 0) {
      this.param = {
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
        "search": {
          "series_id": id,
        }
      }
    //  this.searchSeries = name
      this.searchMatch = undefined
      this.searchMarket = undefined
      if(this.searchSport){
        this.param.search['sport_id']=this.searchSport.sport_id
      }
    } else if (type == 2) {
      this.param = {
        "search": {
          "match_id": id
        }
      }
      //this.searchMatch = name
      this.searchMarket = undefined
      if(this.searchSport){
        this.param.search['sport_id']=this.searchSport.sport_id
      }
      if(this.searchSeries){
        this.param.search['series_id']=this.searchSeries.series_id
      }
    } else if (type == 3) {
      this.param = {

        "search": {
          // "event_name": searchData,
          "market_id": id,
          //"type": 1
        }
      }
      //this.searchMarket = name
      if(this.searchSport){
        this.param.search['sport_id']=this.searchSport.sport_id
      }
      if(this.searchSeries){
        this.param.search['series_id']=this.searchSeries.series_id
      }
      if(this.searchMatch){
        this.param.search['match_id']=this.searchMatch.match_id
      }
    } else if (type == 4) {
      this.param = {

        "search": {
          // "event_name": searchData,
          "fancy_id": id,
          //"type": 2
        }
      }
      //this.searchMarket = name
      if(this.searchSport){
        this.param.search['sport_id']=this.searchSport.sport_id
      }
      if(this.searchSeries){
        this.param.search['series_id']=this.searchSeries.series_id
      }
      if(this.searchMatch){
        this.param.search['match_id']=this.searchMatch.match_id
      }
    }
    this.param["page"]= this.settledBetcurrentPage,
    this.param["limit"]=this.settledBetitemsPerPage
    this.filterSearchDropdownValues(this.param.search, type,'settledBets')
    this.param['search']['user_id'] =this.userId
    this.reportService.settleBets(this.param).subscribe((res) => {
      if (res.status) {
        this.toastr.success("Success", '', {
          positionClass: 'toast-bottom-right',
          timeOut: 1000
        });
        this.settledBetData = res.data.data;
        if(res.data.metadata[0]){
          this.settledBettotalItems=res.data.metadata[0].total
          this.settledBetcurrentPage= res.data.metadata[0].page
        }

      } else {
        this.toastr.error(res.msg)
        this.settledBetData=[]
      }
    })

  }

  sportsPl(id,from?:string) {
    this.Id = id;
    let data = {
      "user_id":this.Id == undefined || this.Id == '' ? this.userId : this.Id,
      "search": {
        "event_id": this.event_id == undefined ? '' : this.event_id,
        "type": this.type_id == 1 ? '' : this.type_id
      }

    };
    if (data.search.event_id == '') {
      delete data.search.event_id
    }
    if (data.search.type == '') {
      delete data.search.type
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
    this.reportService.sportsPl(data).subscribe((res) => {
      if (res.status == true) {
        this.userPlList = res.data.users;
        this.userPlList = _.orderBy(this.userPlList, ['user_type_id', 'user_name'], ['desc', 'asc']);
        this.gameList = res.sports;
        this.userName = res.user_name;
        this.parentId = res.parent_id;
        for (let i = 0; i < this.userPlList.length; i++) {
          for (let j = 0; j < this.gameList.length; j++) {

            if ((this.userPlList[i][(this.gameList[j].name).toLowerCase()]) == undefined) {
              this.userPlList[i][(this.gameList[j].name).toLowerCase()] = 0;

            }
          }
        }
        this.cricket = this.userPlList.reduce(
          (a: number, b) => a + b.cricket, 0);
        this.soccer = this.userPlList.reduce(
          (a: number, b) => a + b.soccer, 0);
        this.tennis = this.userPlList.reduce(
          (a: number, b) => a + b.tennis, 0);
        this.casino = this.userPlList.reduce(
          (a: number, b) => a + b.casino, 0);
        this.session = this.userPlList.reduce(
          (a: number, b) => a + b.session, 0);
        this.commission = this.userPlList.reduce(
          (a: number, b) => a + b.share_commission, 0);
        this.total = this.userPlList.reduce(
          (a: number, b) => a + b.total, 0);
      }else{
        this.userPlList=[]
      }
    })
  }

  goToStatement(user_id){
      this.router.navigate(['statement/'+ user_id])
  }
  
  ngOnDestroy(): void {
      
  }

  expoRoute( id){
    let data = {
      "event": "match",
      "filter": {
          "match_id":id.match_id
      },
      "projection": [
          "enable_fancy",
          "inplay",
          "is_created",
          "is_lock",
          "is_active",
          "match_date",
          "bet_count"
      ]
  }
  this.sportService.getExposureRoute(data).subscribe((res) => {
    this.expoRouteData = res.data;
    this.expoRouteData.manualInplay = res.data.inplay;
    let a3 = {...id, ...this.expoRouteData};
    localStorage.setItem('matchData', JSON.stringify(a3));
    this.router.navigate(['match-detail']);
  })
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
}


