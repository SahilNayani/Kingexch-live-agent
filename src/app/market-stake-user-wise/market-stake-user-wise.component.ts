import { Component, OnInit, ViewChild ,TemplateRef} from '@angular/core';
import { DateTime } from '../../dateTime';
import { Router, ActivatedRoute } from '@angular/router';
import { PopoverDirective } from 'ngx-bootstrap/popover';
import { Location } from '@angular/common';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { SportService } from '../services/sport.service';
import { ReportService } from '../services/report.service';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
const _ = require("lodash");
@Component({
  selector: 'app-market-stake-user-wise',
  templateUrl: './market-stake-user-wise.component.html',
  styleUrls: ['./market-stake-user-wise.component.scss']
})
export class MarketStakeUserWiseComponent implements OnInit {
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
  modalRef: BsModalRef;
  todayDate: Date = new Date()
  itemsPerPage: number = 50;
  currentPage: number = 1;
  totalItems: number = 0;
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
  searchUser: any;
  a: any = [];
  todayDateTime:Date=new Date()
  userlist: any = [
    { "user_name": "user1" },
    { "user_name": "user2" },
    { "user_name": "user3" },
    { "user_name": "user4" },
    { "user_name": "user5" },
  ]
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
  userParentName: any;
  parentList: any;
  type: any;
  constructor(private sport: SportService,private modalService: BsModalService,private route: ActivatedRoute, private router: Router, private locationBack: Location, private report: ReportService, private toastr: ToastrService) {
    this.route.params.subscribe(params => {
      this.event_id = params.event_id;
      this.type_id = params.type;
      this.match_id = params.matchId;
      this.sport_name = params.sportName;
      this.series_name = params.seriesName;
      this.match_name = params.matchName;
      this.market_name = params.eventName;
    })
  }

  // openStartDate: Date = new Date()
  // openEndDate: Date = new Date()
  // startAt: Date = new Date()
  param: any;
  ngOnInit() {
    if (this.match_id == undefined) {
      this.showBetButton = false;
    } else {
      this.showBetButton = true;
    }
    this.userDetails = JSON.parse(localStorage.getItem('adminDetails'));
    this.type = this.userDetails.user_type_id;
    this.todayDateTime.setHours(23, 59, 59);
    this.startdateTime.setHours(0, 0, 0, 0);
    this.enddateTime.setHours(23, 59, 59);
    this.sportsPl('','filterBtnClick');
    //this.startAt.setHours(23, 59, 59);
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

  goToBack() {
    this.locationBack.back();
  }
  clear() {
    this.param = undefined
    this.time = void 0;
    this.date = void 0;
    this.startdateTime = void 0;
    this.enddateTime = void 0;
  }

  sportsPl(id,from?:string) {
    this.Id = id;
    let data = {
      "user_id": id == '' ? this.userDetails.user_id : id
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
    this.report.fancyTotalStakeUser(data).subscribe((res) => {
      if (res.status == true) {
        this.userPlList = res.data;
        this.parentId = res.parent_id;
        this.userName = res.user_name;
        this.total = this.userPlList.reduce(
          (a: number, b) => a + b.stack, 0);
      }else{
        this.userPlList=[]
      }
    })
  }

  goToStatement(user_id,userTypeId){
    this.router.navigate(['statement/'+ user_id + '/'+ userTypeId])
  }
  onClickClear(){
    this.startdateTime=new Date();
    this.enddateTime=new Date();
    this.startdateTime.setHours(0, 0, 0, 0);
    this.enddateTime.setHours(23, 59, 59);
    this.sportsPl('','filterBtnClick');
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
}
