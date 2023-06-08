import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { SportService } from '../services/sport.service';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { ReportService } from '../services/report.service';
@Component({
  selector: 'app-match-rollback',
  templateUrl: './match-rollback.component.html',
  styleUrls: ['./match-rollback.component.scss']
})
export class MatchRollbackComponent implements OnInit {
  unDeclaredMatch: any;
  moment: any = moment;
  selection_name: any;
  selection_id: any;
  runner: any;
  assendingSportname: boolean = true;
  assendingSeriesname: boolean = true;
  assendingMatchname: boolean = true;
  assendingDate: boolean = true;
  itemsPerPage: number = 10;
  currentPage: number = 1;
  total_items: number = 0;
  searchMatch: any
  searchUser: any
  searchMarket: any
  searchSport: any
  searchSeries: any
  param: any
  SportList: any;
  SeriesList: any;
  MatchList: any;
  initialSportList: any;
  userlist: any = [
    { "user_name": "user1" },
    { "user_name": "user2" },
    { "user_name": "user3" },
    { "user_name": "user4" },
    { "user_name": "user5" },
  ]
  MarketList: any;


  constructor(private locationBack: Location, private sport: SportService,
    private toastr: ToastrService, private reportService: ReportService) { }


  ngOnInit(): void {
    this.getSportList()
    this.result('', '');
  }


  goToBack() {
    this.locationBack.back();
  }


  result(marketId, index) {
    if (marketId == '' || index == '') {
      let data = {}
      this.sport.matchRollbackList(data).subscribe((res) => {
        if (res.status == true) {
          this.unDeclaredMatch = res.data.data;
          this.unDeclaredMatch = this.unDeclaredMatch.filter(t => t.result != null);
        }
      })
    }
  }

  rollback(match) {
    if (confirm("Are you sure want to Rollback Result "+"\n"+ match.match_name+ " --> " + match.market_name)) {
    if (match.is_abandoned == 0) {
      let data = {
        'market_id': match.market_id
      };
      this.sport.matchRollback(data).subscribe((res) => {
        if (res.status == true) {
          this.toastr.success(res.msg, '', {
            positionClass: 'toast-bottom-right',
            timeOut: 1000
          });
          this.result('', '');
        } else {
          this.toastr.error(res.msg, '', {
            timeOut: 10000,
          })
        }
      })
    } else {
      let data = {
        'market_id': match.market_id,
        'rollback': 1
      };
      this.sport.matchAbonded(data).subscribe((res) => {
        if (res.status == true) {
          this.toastr.success(res.msg, '', {
            positionClass: 'toast-bottom-right',
            timeOut: 1000
          });
          this.result('', '');
        } else {
          this.toastr.error(res.msg, '', {
            timeOut: 10000,
          })
        }
      })
    }
  }
  }

  filterList(parameter, sortOrder) {
    if (parameter == 'sport_name') {
      this.assendingSportname = !this.assendingSportname
    } else if (parameter == 'series_name') {
      this.assendingSeriesname = !this.assendingSeriesname
    } else if (parameter == 'match_name') {
      this.assendingMatchname = !this.assendingMatchname
    } else if (parameter == 'createdAt') {
      this.assendingDate = !this.assendingDate
    }

    if (sortOrder == 'asc') {
      this.unDeclaredMatch = this.unDeclaredMatch.sort((a, b) => a[parameter].localeCompare(b[parameter]));
    } else if (sortOrder == 'desc') {
      this.unDeclaredMatch = this.unDeclaredMatch.sort((a, b) => b[parameter].localeCompare(a[parameter]));
    }
  }

  getSportList() {
    let data = {
      type: "matchRollback",
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

  getMatchResultFilterData(type, id, name) {
    if (type == 0) {
      this.param = {
        "search": {
          "sport_id": id
        }
      }
     // this.searchSport = name
      this.searchMatch = undefined
      this.searchMarket = undefined
      this.searchSeries = undefined
    } else if (type == 1) {
      this.param = {
        "search": {
          "series_id": id,
        }
      }
      //this.searchSeries = name
      if(this.searchSport){
        this.param.search['sport_id']=this.searchSport.sport_id
      }
      this.searchMatch = undefined
      this.searchMarket = undefined
    } else if (type == 2) {
      this.param = {
        "search": {
          "match_id": id
        }
      }
      //this.searchMatch = name
      if(this.searchSport){
        this.param.search['sport_id']=this.searchSport.sport_id
      }
      if(this.searchSeries){
        this.param.search['series_id']=this.searchSeries.series_id
      }
      this.searchMarket = undefined
    } else if (type == 3) {

      this.param = {

        "search": {
          "fancy_id": id,
          //"type": 1
        }
      }
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
          "market_id": id,
          // "type": 2
        }
      }
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

    // this.param["page"]=1
    // this.param["limit"]=50
    this.filterSearchDropdownValues(this.param.search, type)
    this.sport.matchRollbackList(this.param).subscribe((res) => {
      if (res.status == true) {
        this.unDeclaredMatch = res.data.data;
        this.unDeclaredMatch = this.unDeclaredMatch.filter(t => t.result != null);
      }
    })

  }

  filterSearchDropdownValues(search, type) {
    let listParams = {
      type: "matchRollback",
      search: search
    }
    this.reportService.eventList(listParams).subscribe((res) => {
      if (res.status == true) {
        if (type == 0) {
          this.SeriesList = res.data[0].series;
          this.MatchList = res.data[0].matches;
          this.MarketList = res.data[0].markets;
        } else if (type == 1) {
          this.MatchList = res.data[0].matches;
          this.MarketList = res.data[0].markets;
        } else if (type == 2) {
          this.MarketList = res.data[0].markets;
        }

      }
    })
  }


  clear() {
    this.searchSport = undefined
    this.searchMatch = undefined
    this.searchMarket = undefined
    this.searchSeries = undefined
    this.param = undefined
    this.result('', '');
    this.SportList = this.initialSportList.sports;
    this.SeriesList = this.initialSportList.series;
    this.MatchList = this.initialSportList.matches;
    this.MarketList = this.initialSportList.markets;
  }
}
