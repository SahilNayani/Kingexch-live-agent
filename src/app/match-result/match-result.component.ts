import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { SportService } from '../services/sport.service';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { ReportService } from '../services/report.service';
@Component({
  selector: 'app-match-result',
  templateUrl: './match-result.component.html',
  styleUrls: ['./match-result.component.scss']
})
export class MatchResultComponent implements OnInit {
  unDeclaredMatch: any;
  moment: any = moment;
  selection_name: any;
  selection_id: any;
  runner: any;
  index: any;
  view: boolean;
  runners: any;
  winnerTeam: any;
  winnerName: any = '';
  popData: boolean;
  assendingSportname: boolean = true;
  assendingSeriesname: boolean = true;
  assendingMatchname: boolean = true;
  assendingDate: boolean = true;
  itemsPerPage: number = 50;
  currentPage: number = 1;
  total_items: number = 0;
  selectSelection: Array<any> = [];
  searchMatchName: any;
  searchMatch: any
  searchUser: any
  searchMarket: any
  searchSport: any
  searchSeries: any
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
  param: any;
  initialSportList: any;
  constructor(private locationBack: Location, private sport: SportService,
    private toastr: ToastrService, private reportService: ReportService) { }

  ngOnInit(): void {
    this.popData = false;
    this.result('', '');
    this.getSportList()
  }

  goToBack() {
    this.locationBack.back();
  }

  result(marketId, index) {
    if (marketId == '' || index == '') {
      let data = {

      }
      this.sport.matchResultList(data).subscribe((res) => {
        this.unDeclaredMatch = res.data.data;
        this.total_items = res.data.metadata[0].total;
        this.unDeclaredMatch = this.unDeclaredMatch.filter(t => t.result == null);
        this.unDeclaredMatch.forEach(element => {
          this.selectSelection.push(null)
        });
      })
    } else {
      let data = {
        "search": {
          "market_id": marketId.market_id,
          "_id": marketId._id
        }
      }
      this.sport.matchResultList(data).subscribe((res) => {
        this.unDeclaredMatch[index] = res.data.data[0];
        // this.unDeclaredMatch.forEach(element => {
        this.selectSelection[index] = null
        //});
      })
    }

  }
  selectRunner(data, match, i) {
    match.runners.forEach(element => {
      if (this.selectSelection[i] == element.selection_id) {
        this.runner = element;
      }

    });

  }
  saveResult(match, i) {
    if (confirm("Are you sure want to declare Result "+"\n"+ match.match_name+ " --> "  + match.market_name)) {
    let data = {
      "sport_id": match.sport_id,
      "sport_name": match.sport_name,
      "series_id": match.series_id,
      "series_name": match.series_name,
      "match_id": match.match_id,
      "match_name": match.match_name,
      "market_id": match.market_id,
      "market_name": match.market_name,
      "selection_id": this.runner.selection_id,
      "selection_name": this.runner.selection_name
    }
    this.sport.matchResult(data).subscribe((res) => {
      if (res.status == true) {
        this.toastr.success(res.msg, '', {
          positionClass: 'toast-bottom-right',
          timeOut: 1000
        })


      } else {
        this.toastr.error(res.msg, '', {
          timeOut: 10000,
        })
      }
    })
  }
  }

  abonded(match, i) {
    if (confirm("Are you sure want to Abond Result "+"\n"+ match.match_name + " --> " + match.market_name)) {
    let data = {
      "market_id": match.market_id,
    }
    this.sport.matchAbonded(data).subscribe((res) => {
      if (res.status == true) {
        this.toastr.success(res.msg, '', {
          positionClass: 'toast-bottom-right',
          timeOut: 1000
        })
        //this.result('', '');
      } else {
        this.toastr.error(res.msg, '', {
          timeOut: 10000,
        })
      }
    })
  }
  }
  viewResult(i) {
    this.index = i;
    this.view = true
    //this.selectSelection[i]=this.winnerTeam 

    setTimeout(() => {
      this.closeResultPopUp(this.index)
    }, 5000);
  }

  closeResultPopUp(i) {
    this.view = false;
  }

  winnerData(match, i?: number) {
    this.selectSelection.forEach((element, index) => {
      this.selectSelection[index] = null
    });
    this.sport.winnerResult(match.market_id).subscribe((res) => {
      this.runners = res[0].runners;
      for (let i = 0; i < this.runners.length; i++) {
        if (this.runners[i].status == 'WINNER' || this.runners[i].status == 'Winner' || this.runners[i].status == 'winner') {
          this.winnerTeam = this.runners[i];
          break;
        }
      }
      let matchRunner = match.runners;
      if (this.winnerTeam == undefined) {
        this.winnerName = "Result not declared";
        this.popData = false;
      } else {
        for (let j = 0; j < matchRunner.length; j++) {
          if (matchRunner[j].selection_id == this.winnerTeam.selectionId) {
            this.selectSelection[i] = matchRunner[j].selection_id;
            this.selectRunner(null, match, i)
            this.winnerName = matchRunner[j].selection_name;
            this.popData = true;
            break;
          } else {
            this.winnerName = "Result not declared";
            this.popData = false;
          }
        }
      }

    })
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

  //   datefilterList(parameter,sortOrder){
  //     this.assendingDate=!this.assendingDate
  //     if(sortOrder=='asc'){
  //       this.unDeclaredMatch=this.unDeclaredMatch.sort((a, b) => {
  //         <any>new Date(a[parameter]) - <any>new Date(b[parameter]);

  //      });
  //     }else{
  //     this.unDeclaredMatch=this.unDeclaredMatch.sort((a, b) => {
  //      <any>new Date(b[parameter]) - <any>new Date(a[parameter]);

  //   });
  // }
  // }

  pageChange(newPage?: number) {
    if(newPage){
      this.currentPage = newPage;
    }
  
    // this.usersListReqPageQuery = {
    //   page: this.currentPage,
    //   limit: this.itemsPerPage,
    //   searchQuery: this.searchQuery
    // };
    // if (this.levelParentUserId != null && this.levelParentUserId != undefined) {
    //   this.getSubUserChild(this.levelParentUserId, null);
    // }
    // else {
    //   this.getUserChildDetail(this.user_id,false);
    // }
  }

  compareFn(c1: any, c2: any): boolean {
    return c1 && c2 ? c1.selectedClient === c2.selectedClient : c1 === c2;
  }

  getSportList() {
    let data = {
      type: "matchResult",
      search: {}
    };
    this.reportService.eventList(data).subscribe((res) => {
      if (res.status == true) {
        this.initialSportList = res.data[0]
        this.SportList = res.data[0].sports;
        this.SeriesList = res.data[0].series;
        this.MatchList = res.data[0].matches;
        this.MarketList = res.data[0].markets;
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
          "fancy_id": id
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

    this.param["page"] = 1
    this.param["limit"] = 50
    this.filterSearchDropdownValues(this.param.search, type)
    this.sport.matchResultList(this.param).subscribe((res) => {
      this.unDeclaredMatch = res.data.data;
      this.total_items = res.data.metadata[0].total;
      this.unDeclaredMatch = this.unDeclaredMatch.filter(t => t.result == null);
      this.unDeclaredMatch.forEach(element => {
        this.selectSelection.push(null)
      });
    })

  }

  filterSearchDropdownValues(search, type) {
    let listParams = {
      type: "matchResult",
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
