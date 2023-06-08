import { Component, OnInit,TemplateRef } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Router, ActivatedRoute } from "@angular/router";
import { Location } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
import { SportService } from '../services/sport.service';
import { ReportService } from '../services/report.service';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged} from 'rxjs/operators';
@Component({
  selector: 'app-view-bets',
  templateUrl: './view-bets.component.html',
  styleUrls: ['./view-bets.component.scss']
})
export class ViewBetsComponent implements OnInit {
  match_id: any;
  market_id: any;
  betData: any;
  moment: any = moment;
  typeId: any;
  adminDetails: any;
  type: any;
  sport_name: string;
  series_name: string;
  match_name: string;
  searchSelection: any
  searchUser: any
  searchMarket: any
  searchSport: any
  searchSeries: any
  searchStake: any
  searchBetType: any
  market_name: any
  searchRate: any
  itemsPerPage: number = 50;
  currentPage: number = 1;
  total_items: number = 0;
  selectionList: any;
  searchSelectionId: any;
  betType: any;
  userlist: any = [
    { "user_name": "user1" },
    { "user_name": "user2" },
    { "user_name": "user3" },
    { "user_name": "user4" },
    { "user_name": "user5" },
  ]
  MarketList: any = [
    { "match_name": "Match Odds" }
  ]
  openStartDate: Date
  todayDate: Date = new Date()
  userId: any;
  parentList: any;
  userParentName: any;
  modalRef: BsModalRef;
  customInput : Subject<Number> = new Subject();
  constructor(private router: Router, public sport: SportService,private modalService: BsModalService,
    private toastr: ToastrService, private locationBack: Location, private route: ActivatedRoute, private reportService: ReportService) {
    this.route.params.subscribe((params) => {
      this.match_id = params.matchId;
      this.market_id = params.marketId;
      this.typeId = params.type;
      this.sport_name = params.sportName;
      this.series_name = params.seriesName;
      this.match_name = params.matchName;
      this.market_name = params.marketName;
      this.userId = params.id;
    });
  }

  ngOnInit(): void {
    this.adminDetails = JSON.parse(localStorage.getItem('adminDetails'));
    this.type = this.adminDetails.user_type_id;
    this.getMyBets()
    this.getSportList();
    this.customInput.pipe(debounceTime(500),distinctUntilChanged()).subscribe(value =>{
      this.getMyBets()
    });
    
  }
  goToBack() {
    this.locationBack.back();
  }

  getMyBets(from?: string) {
    let data;
    if (this.typeId == 1) {
      data = {
        "match_id": this.match_id,
        "limit": this.itemsPerPage,
        "page": this.currentPage,
        "search": {
          "market_id": this.market_id,
          "user_id": this.userId == undefined ? '' : this.userId,
          // "odds":this.searchRate,
          // "stack":this.searchStake,
          "selection_id": this.searchSelectionId,
          //" selection_name":this.searchSelection
        }
      }
      if (data.search.user_id == '') {
        delete data.search.user_id
      }
    } else {
      data = {
        "match_id": this.match_id,
        "limit": this.itemsPerPage,
        "page": this.currentPage,
        "search": {
          "fancy_id": this.market_id,
          "user_id": this.userId == undefined ? '' : this.userId,
          // "odds":this.searchRate,
          // "stack":this.searchStake,
          "selection_id": this.searchSelectionId,
          //"selection_name":this.searchSelection
        }
      }
      if (data.search.user_id == '') {
        delete data.search.user_id
      }
    }
    if ( this.betType) {
      if(this.betType != "all"){
        data.search['is_back'] = parseInt(this.betType)
      }
     
    }
    if (this.searchRate) {
      data.search['odds'] = this.searchRate
    }
    if (this.searchStake) {
      data.search['stack'] = parseInt(this.searchStake)
    }

    this.sport.getBet(data).subscribe((res) => {
      if (res.status == false) {
        this.betData = []
        this.toastr.error(res.msg)
      } else {
        this.betData = res.data.data;
        this.market_name = res.data.data[0].market_name
        this.total_items = res.data.metadata[0].total;
      }

      // this.betDataLength = this.betData.length;
      // this.initialBetData= res.data.data;
      // this.matchedBets = this.betData.filter(t => t.is_fancy == '0' && t.delete_status == '0');
      // this.matchedBetsLength = this.matchedBets.length;
      // this.fancyBets = this.betData.filter(t => t.is_fancy == '1' && t.delete_status == '0');
      // let oldfancyBetsLength=this.fancyBetsLength
      // this.fancyBetsLength = this.fancyBets.length;
      // if(oldfancyBetsLength != this.fancyBetsLength){
      //   this.getFancyLiability()
      // }
      // this.deletedBets = this.betData.filter(t => t.delete_status != '0');
      // this.deletedBetsLength = this.deletedBets.length;
    }, (err) => {
      // this.scoreApi();
      console.log(err);

    })
  }

  pageChange(newPage?: number) {
    if (newPage) {
      this.currentPage = newPage
    }
    this.getMyBets()
  }

  getSportList() {
    let data = {
      "type": "viewBet",
      "search": {
        "market_id": this.market_id
      }
    }
    this.reportService.eventList(data).subscribe((res) => {
      if (res.status == true) {
        this.selectionList = res.data
      }
    })
  }

  onClickFilterViewBets(selection?: any) {
    
    if (selection) {
      this.searchSelection = selection.selection_name
      this.searchSelectionId = selection.selection_id
     
    }
  this.getMyBets()
    
  }
  onClickFilterInputViewBets(input){
    this.customInput.next(input);
  }

  clear() {
    this.searchSelection = undefined
    this.searchSelectionId = undefined
    this.searchRate = undefined
    this.searchStake = undefined
    this.betType = undefined
    this.openStartDate = undefined
    this.getMyBets()
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
