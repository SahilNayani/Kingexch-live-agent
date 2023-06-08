import { Component, OnInit, ChangeDetectorRef, TemplateRef } from '@angular/core';
import { Location } from '@angular/common';
import { UsersService } from '../services/users.service';
import { SportService } from '../services/sport.service';
import { SocketServiceService } from '../services/socket-service.service';
import { ToastrService } from 'ngx-toastr';
import { CookieService } from 'ngx-cookie-service';
import { Subscriber } from 'rxjs';
import { Router, ActivatedRoute } from "@angular/router";
import { HttpClient } from '@angular/common/http';
// import { ThrowStmt } from '@angular/compiler';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppValidationService } from '../app-validation/app-validation.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ValidatorControls } from '../app-validation/validation-controls.directive';
import { PreviousRouteService } from '../services/previous-route.service';
// import * as this.sportsSettingValues from './sport-stack-values.json'
@Component({
  selector: 'app-block-market',
  templateUrl: './block-market.component.html',
  styleUrls: ['./block-market.component.scss']
})
export class BlockMarketComponent implements OnInit {
  user_id: string;
  userDetail: any;
  allSportsDetails: any
  allSports: any;
  child_user_id: string
  child_user_type_id: string
  getAllSeries: any;
  sportIndex;
  seriesIndex;
  maatchIndex;
  isSocket;
  allMacthDetails: any;
  public market_api: any;
  marketData: any;
  selectedMarket: any;
  runnerData: any;
  runnerDynamicData: any = [];
  marketSelection: any;
  updateStatus: any;
  selectedFilter: string = 'all'
  runner: any;
  marketList: any;
  showSelectedUserName: any;
  selectedUserId: any;
  modalRef: BsModalRef;
  sportsForm: FormGroup;
  specificUserDetails = [];
  hiddenpass: Array<boolean> = [];
  selectedSport: any;
  matchButton: Array<boolean> = [];
  seriesButton: Array<boolean> = [];
  marketButton: Array<boolean> = [];
  specificUserParentDetails:any
  selectedIndex:number = 0;
  searchSeries:Array<string>=[];
  searchMatch:Array<string>=[];
  popUpHead: any;
  sessionSetting: boolean;
  Id: any;
  type: any;
  sportsSettingValues:any;
  blockVisibleItem: any;
  tvUrl: any;
  constructor(private router: Router,private locationBack: Location, private http: HttpClient, private sportservice: SportService, private cdRef: ChangeDetectorRef,
    private toastr: ToastrService, private cookie: CookieService, private socketService: SocketServiceService, private fb: FormBuilder,
    private route: ActivatedRoute, private usersService: UsersService, private appValidationService: AppValidationService, private modalService: BsModalService,
    private previousRouteService: PreviousRouteService) {
    this.route.params.subscribe((params) => {
      this.child_user_id = params.userid;
      this.child_user_type_id = params.userTypeId
    });
  }

  async ngOnInit() {
    // await this.socketService.setUpSocketConnection();
    this.isSocket = this.cookie.get('is_socket');
    this.isSocket = 0;
    this.user_id = localStorage.getItem('userId');
    // this.socketListenersUser();
    this.userDetail = JSON.parse(localStorage.getItem('adminDetails'));
    this.getAllSports();
    
    $("#multilevelList a span").on('click', function () {
      var link = $(this);
      var closest_ul = link.closest("ul");
      var parallel_active_links = closest_ul.find(".active")
      var closest_li = link.closest("li");
      var link_status = closest_li.hasClass("active");
      var count = 0;
      closest_ul.find("ul").css('display: none', function () {
        if (++count == closest_ul.find("ul").length)
          parallel_active_links.removeClass("active");
      });
      if (!link_status) {
        closest_li.children("ul").css('display: block');
        closest_li.addClass("active");
      }
    })
    this.sportsForm = this.fb.group({
      sports_settings: this.fb.array([])
    })
  }


  // socketOnEvent(eventName, callback) {
  //   this.socketService.socket.on(eventName, data => callback(data));
  // }

  // socketEmitEvent(eventName, data) {
  //   this.socketService.socket.emit(eventName, data);
  // }

  // socketListenersUser() {
  //   this.socketOnEvent(`getAllActiveSports`, data => {
  //     if (data.status == true) {
  //       this.allSportsDetails = data.data;
  //     } else {
  //       this.toastr.error(data.msg, '', {
  //         timeOut: 10000,
  //       });
  //     }
  //   });

  //   this.socketOnEvent(`updateSportsStatus`, data => {
  //     if (data.status == true) {
  //       this.toastr.success(data.msg,'',{
  //         positionClass: 'toast-bottom-right',
  //         timeOut:1000
  //        });
  //       this.getAllSports();
  //     } else {
  //       this.toastr.error(data.msg, '', {
  //         timeOut: 10000,
  //       });
  //     }
  //   });

  //   this.socketOnEvent(`getOnlineSeries`, data => {
  //     if (data.status == true) {
  //       this.toastr.success(data.msg,'',{
  //         positionClass: 'toast-bottom-right',
  //         timeOut:1000
  //        });
  //       this.allSportsDetails[this.seriesIndex]["seriesDetails"] = data.data;
  //       this.cdRef.detectChanges();
  //       this.getAllSeries = data.data;
  //     } else {
  //       this.toastr.error(data.msg, '', {
  //         timeOut: 10000,
  //       });
  //     }
  //   });

  //   this.socketOnEvent(`updateSeriesStatus`, data => {
  //     if (data.status == true) {
  //       if (data.is_active == 1)
  //         this.allSportsDetails[data.sport_index]["seriesDetails"][data.series_index].is_active = 1;
  //       else
  //         this.allSportsDetails[data.sport_index]["seriesDetails"][data.series_index].is_active = 0;
  //       this.toastr.success(data.msg,'',{
  //         positionClass: 'toast-bottom-right',
  //         timeOut:1000
  //        });
  //     } else {
  //       this.toastr.error(data.msg, '', {
  //         timeOut: 10000,
  //       });
  //     }
  //   });

  //   this.socketOnEvent(`createSeries`, data => {
  //     if (data.status == true) {
  //       this.allSportsDetails[data.sport_index]["seriesDetails"][data.series_index].is_created = 1;
  //       this.allSportsDetails[data.sport_index]["seriesDetails"][data.series_index].is_active = 1;
  //       this.toastr.success(data.msg,'',{
  //         positionClass: 'toast-bottom-right',
  //         timeOut:1000
  //        });
  //     } else {
  //       this.toastr.error(data.msg, '', {
  //         timeOut: 10000,
  //       });
  //     }
  //   });

  //   this.socketOnEvent(`getOnlineMatch`, data => {
  //     if (data.status == true) {
  //       this.toastr.success(data.msg,'',{
  //         positionClass: 'toast-bottom-right',
  //         timeOut:1000
  //        });
  //       this.allSportsDetails[this.sportIndex]["seriesDetails"][this.seriesIndex]["matchDetails"] = data.data;
  //       this.cdRef.detectChanges();
  //       this.allMacthDetails = data.data;
  //       this.market_api = data.market_api;
  //     } else {
  //       this.toastr.error(data.msg, '', {
  //         timeOut: 10000,
  //       });
  //     }
  //   });


  //   this.socketOnEvent(`getOnlineMarket`, data => {
  //     if (data.status == true) {
  //       this.toastr.success(data.msg,'',{
  //         positionClass: 'toast-bottom-right',
  //         timeOut:1000
  //        });
  //       this.allSportsDetails[this.sportIndex]["seriesDetails"][this.seriesIndex]["matchDetails"][this.maatchIndex]["marketDetails"] = data.data;
  //       this.cdRef.detectChanges();
  //       this.marketList = data.data;
  //     } else {
  //       this.toastr.error(data.msg, '', {
  //         timeOut: 10000,
  //       });
  //     }
  //   });
  // }

  getAllSports() {
    if (this.isSocket != 1) {
      let param = {
        user_id: this.child_user_id == undefined ? this.userDetail._id : this.child_user_id,
      }
      this.sportservice.getAllSportsList(param).subscribe(result => {
        this.allSportsDetails = result.data
        if (this.previousRouteService.getPreviousUrl().includes('/match-detail')){
          if(JSON.parse(localStorage.getItem('allSportsDetails'))){
            this.allSportsDetails=JSON.parse(localStorage.getItem('allSportsDetails'));
            this.matchButton=JSON.parse(localStorage.getItem('matchButton'));
            this.seriesButton=JSON.parse(localStorage.getItem('seriesButton'));
          
          }
         
        }
        this.allSports = result.data
      })
    }
    else {
      let param = {
        logged_in_user_id: this.user_id,
        userid: this.child_user_id == undefined ? this.userDetail._id : this.child_user_id,
      }
      // this.socketEmitEvent('get-all-active-sports', param);
    }
  }

  goToBack() {
    this.locationBack.back();
  }

  updateSportStatus(sport) {
    if (sport.is_created == 0) {
      let param = {
        "sport_id": sport.sport_id,
        "name": sport.name
      };
      this.sportservice.createSport(param).subscribe((res) => {
        if (res.status == true) {
          this.getAllSports();

          this.toastr.success(res.msg,'',{
            positionClass: 'toast-bottom-right',
            timeOut:1000
           });
        } else {
          this.toastr.error(res.msg, '', {
            timeOut: 10000,
          });
        }
      })
    } else {
      if (this.isSocket != 1) {
        let request = {
          "userid": this.child_user_id == undefined ? this.userDetail._id : this.child_user_id,
          "sport_id": sport.sport_id,
          "is_active": sport.is_active == 0 ? 1 : 0,
          "user_typeId": this.child_user_type_id == undefined ? this.userDetail.user_type_id : this.child_user_type_id
        }
        this.sportservice.updateSportsStatus(request).subscribe(result => {
          if (result.status == true) {
            this.toastr.success(result.msg,'',{
              positionClass: 'toast-bottom-right',
              timeOut:1000
             });
            this.getAllSports();
          } else {
            this.toastr.error(result.msg, '', {
              timeOut: 10000,
            });
          }
        })
      }
      else {
        let request = {
          "logged_in_user_id": this.user_id,
          "userid": this.child_user_id == undefined ? this.userDetail._id : this.child_user_id,
          "sport_id": sport.sport_id,
          "is_active": sport.is_active == 0 ? 1 : 0,
          "user_typeId": this.child_user_type_id == undefined ? this.userDetail.user_type_id : this.child_user_type_id
        }
        // this.socketEmitEvent('update-sports-status', request);
      }
    }
  }

  getOnlineSeries(sport, sport_id, index) {
    if (sport.is_created == 0 || sport.is_active == 0) {
      this.seriesButton[index] = false;
    } else {
      this.seriesButton[index] = true;
    }
    if (this.allSportsDetails[index]["seriesDetails"]) {
      delete this.allSportsDetails[index]["seriesDetails"]
    } else {
      this.seriesIndex = index;
      if (this.isSocket != 1) {
        let param = {
          "user_id": this.child_user_id == undefined ? this.userDetail._id : this.child_user_id,
          "sport_id": sport_id
        }
        this.sportservice.getSeriesList(param).subscribe(result => {
          if (result.status == true) {

            this.toastr.success(result.msg,'',{
              positionClass: 'toast-bottom-right',
              timeOut:1000
             });
            this.allSportsDetails[index]["seriesDetails"] = result.data;
            this.cdRef.detectChanges();
            this.getAllSeries = result.data;
          } else {
            this.toastr.error(result.msg, '', {
              timeOut: 10000,
            });
          }
        })
      }
      else {
        let param = {
          "logged_in_user_id": this.user_id,
          "user_id": this.child_user_id == undefined ? this.userDetail._id : this.child_user_id,
          "sport_id": sport_id
        }
        // this.socketEmitEvent('get-online-series', param);
      }
    }
  }

  updateSeriesStatus(event, series, sportindex, seriesIndex) {
    if (series.is_created == 1) {
      if (this.isSocket != 1) {
        let request = {
          "userid": this.child_user_id == undefined ? this.userDetail.user_id : this.child_user_id,
          "series_id": series.series_id,
          "is_active": series.is_active == 1 ? 0 : 1,
          "user_typeId": this.child_user_type_id == undefined ? this.userDetail.user_type_id : this.child_user_type_id
        }
        this.sportservice.updateSeries(request).subscribe(result => {
          if (result.status == true) {
            if (request.is_active == 1){
              this.allSportsDetails[sportindex]["seriesDetails"][seriesIndex].is_active = 1;

            //onclick of series switch button showing match and market switch buttons 
                this.matchButton[seriesIndex]=true
                   this.marketButton.forEach((element,index) => {
                this.marketButton[index]=true
            })
            
          }else{
              this.allSportsDetails[sportindex]["seriesDetails"][seriesIndex].is_active = 0;
                //onclick of series switch button showing match and market switch buttons 
                this.matchButton[seriesIndex]=false
                this.marketButton.forEach((element,index) => {
                  this.marketButton[index]=false
              })
            this.toastr.success(result.msg,'',{
              positionClass: 'toast-bottom-right',
              timeOut:1000
             });
          }
          } else {
            this.toastr.error(result.msg, '', {
              timeOut: 10000,
            });
          }
        })
      }
      else {
        let request = {
          "logged_in_user_id": this.user_id,
          "userid": this.child_user_id == undefined ? this.userDetail._id : this.child_user_id,
          "series_id": series.series_id,
          "is_active": series.is_active == 1 ? 0 : 1,
          "user_typeId": this.child_user_type_id == undefined ? this.userDetail.user_type_id : this.child_user_type_id,
          "sport_index": sportindex,
          "series_index": seriesIndex
        }
        // this.socketEmitEvent('update-series-status', request);
      }
    } else {
      let request = {
        "name": series.name,
        "is_manual": series.is_manual,
        "sport_id": series.sport_id,
        "series_id": series.series_id
      }
      if (this.isSocket != 1) {
        this.sportservice.createSeries(request).subscribe(result => {
          if (result.status == true) {
            this.allSportsDetails[sportindex]["seriesDetails"][seriesIndex].is_created = 1;
            this.allSportsDetails[sportindex]["seriesDetails"][seriesIndex].is_active = 1;
              this.matchButton[seriesIndex]=true
            this.toastr.success(result.msg,'',{
              positionClass: 'toast-bottom-right',
              timeOut:1000
             });
          } else {
            this.toastr.error(result.msg, '', {
              timeOut: 10000,
            });
          }
        })
      }
      else {
        let request = {
          "name": series.name,
          "is_manual": series.is_manual,
          "sport_id": series.sport_id,
          "series_id": series.series_id,
          "sport_index": sportindex,
          "series_index": seriesIndex
        }
        // this.socketEmitEvent('create-series', request);
      }
    }
  }

  getOnlineMatchDetails(sport_id, series, sportindex, seriesIndex) {
    this.sportIndex = sportindex;
    this.seriesIndex = seriesIndex;
    if (series.is_created == 0 || series.is_active == 0) {
      this.matchButton[seriesIndex] = false;
    } else {
      this.matchButton[seriesIndex] = true;
    }
    if (this.allSportsDetails[sportindex]["seriesDetails"][seriesIndex]["matchDetails"]) {
      delete this.allSportsDetails[sportindex]["seriesDetails"][seriesIndex]["matchDetails"]
    } else {
      if (this.isSocket != 1) {
        let param = {
          "sport_id": sport_id,
          "series_id": series.series_id
        }
        this.sportservice.getOnlineMatch(param).subscribe(result => {

          if (result.status == true) {

            this.toastr.success(result.msg,'',{
              positionClass: 'toast-bottom-right',
              timeOut:1000
             });
            if(this.searchSeries[sportindex] == ''){
              this.allSportsDetails[sportindex]["seriesDetails"][seriesIndex]["matchDetails"] = result.data;
            }else{
              this.allSportsDetails[sportindex]["seriesDetails"].forEach((element,index) => {
                if(element.series_id ==series.series_id){
                  this.allSportsDetails[sportindex]["seriesDetails"][index]["matchDetails"] = result.data;
                }
              });
            }
         
            this.cdRef.detectChanges();
            this.allMacthDetails = result.data;
            this.market_api = result.market_api;
          } else {
            this.toastr.error(result.msg, '', {
              timeOut: 10000,
            });
          }
        })
      }
      else {
        let param = {
          "user_id": this.child_user_id == undefined ? this.userDetail._id : this.child_user_id,
          "sport_id": sport_id,
          "series_id": series.series_id
        }
        // this.socketEmitEvent('get-online-match', param);
      }
    }
  }

  updateMatchStatus(event, match, sportIndex, seriesIndex, matchIndex) {
    if (match.is_created == '0') {
      if (this.market_api == undefined) {
        this.marketSelection = {
          "sport_id": match.sport_id,
          "series_id": match.series_id,
          "match_id": match.match_id,
          "name": match.name,
          "is_manual": 0,
          "match_date": match.match_date,
        }
        this.sportservice.createMatch(this.marketSelection).subscribe((data) => {
          if (data.status == true) {

            this.toastr.success(data.msg,'',{
              positionClass: 'toast-bottom-right',
              timeOut:1000
             });
            this.allSportsDetails[sportIndex]["seriesDetails"][seriesIndex]["matchDetails"][matchIndex].is_created = 1;
            this.allSportsDetails[sportIndex]["seriesDetails"][seriesIndex]["matchDetails"][matchIndex].is_active = 1;
            // this.marketButton.forEach((element,index) => {
              this.marketButton[matchIndex]=true
              
            // });
            this.runnerDynamicData = [];
            if (this.allSportsDetails[sportIndex]["seriesDetails"][seriesIndex]["matchDetails"][matchIndex]["marketDetails"].length > 0) {
              for (let k = 0; k < this.allSportsDetails[sportIndex]["seriesDetails"][seriesIndex]["matchDetails"][matchIndex]["marketDetails"].length; k++) {
                if (this.allSportsDetails[sportIndex]["seriesDetails"][seriesIndex]["matchDetails"][matchIndex]["marketDetails"][k].name == 'Match Odds') {
                  this.allSportsDetails[sportIndex]["seriesDetails"][seriesIndex]["matchDetails"][matchIndex]["marketDetails"][k].is_active = 1;
                  this.allSportsDetails[sportIndex]["seriesDetails"][seriesIndex]["matchDetails"][matchIndex]["marketDetails"][k].is_created = 1;
                }
              }
            }
          } else {
            this.toastr.error(data.msg, '', {
              timeOut: 10000,
            });
          }
        })
      } else {
        this.http.get(this.market_api + match.match_id).subscribe((result) => {
          this.marketData = result;
          for (let i = 0; i < this.marketData.length; i++) {
            if (this.marketData[i].marketName == 'Match Odds') {
              this.selectedMarket = this.marketData[i];
              this.marketSelection = {
                "sport_id": this.selectedMarket.eventType.id,
                "series_id": this.selectedMarket.competition.id,
                "match_id": this.selectedMarket.event.id,
                "name": this.selectedMarket.event.name,
                "is_manual": 0,
                "match_date": this.selectedMarket.marketStartTime,
              }
              this.sportservice.createMatch(this.marketSelection).subscribe((data) => {
                if (data.status == true) {

                  this.toastr.success(data.msg,'',{
                    positionClass: 'toast-bottom-right',
                    timeOut:1000
                   });
                  this.allSportsDetails[sportIndex]["seriesDetails"][seriesIndex]["matchDetails"][matchIndex].is_created = 1;
                  this.allSportsDetails[sportIndex]["seriesDetails"][seriesIndex]["matchDetails"][matchIndex].is_active = 1;
                  this.marketButton[matchIndex]=true
                  this.runnerDynamicData = [];
                  if (this.allSportsDetails[sportIndex]["seriesDetails"][seriesIndex]["matchDetails"][matchIndex]["marketDetails"].length > 0) {
                    for (let k = 0; k < this.allSportsDetails[sportIndex]["seriesDetails"][seriesIndex]["matchDetails"][matchIndex]["marketDetails"].length; k++) {
                      if (this.allSportsDetails[sportIndex]["seriesDetails"][seriesIndex]["matchDetails"][matchIndex]["marketDetails"][k].name == 'Match Odds') {
                        this.allSportsDetails[sportIndex]["seriesDetails"][seriesIndex]["matchDetails"][matchIndex]["marketDetails"][k].is_active = 1;
                        this.allSportsDetails[sportIndex]["seriesDetails"][seriesIndex]["matchDetails"][matchIndex]["marketDetails"][k].is_created = 1;
                      }
                    }
                  }
                } else {
                  this.toastr.error(data.msg, '', {
                    timeOut: 10000,
                  });
                }
              })
            } else {
            }
          }
        })
      }
    } else {
      if (this.child_user_id == undefined) {
        this.updateStatus = {
          "match_id": match.match_id,
          "is_active": match.is_active == 1 ? 0 : 1
        }
      } else {
        this.updateStatus = {
          "user_id": this.child_user_id,
          "match_id": match.match_id,
          "is_active": match.is_active == 1 ? 0 : 1
        }
      }
      this.sportservice.updateMatchStatus(this.updateStatus).subscribe((result) => {
        if (result.status == true) {
          if (this.updateStatus.is_active == 1){
            this.allSportsDetails[sportIndex]["seriesDetails"][seriesIndex]["matchDetails"][matchIndex].is_active = 1;
              this.marketButton[matchIndex]=true
          }
          else
          {
            this.allSportsDetails[sportIndex]["seriesDetails"][seriesIndex]["matchDetails"][matchIndex].is_active = 0;
              this.marketButton[matchIndex]=false
            
          }
          this.toastr.success(result.msg,'',{
            positionClass: 'toast-bottom-right',
            timeOut:1000
           });
        } else {
          this.toastr.error(result.msg, '', {
            timeOut: 10000,
          });
        }
      })
    }
  }

  filterSportsDataBasedRadioSelect(event, sportName) {
    this.allSportsDetails = this.allSports
    if (sportName == 'all') {
      this.allSportsDetails == this.allSports
    } else {
      this.allSportsDetails = this.allSportsDetails.filter(function (sport) {
        return sport.name == sportName
      });
    }
  }

  
  getMarketList(sport, match, sportIndex, seriesIndex, matchIndex) {
    this.sportIndex = sportIndex;
    this.seriesIndex = seriesIndex;
    this.maatchIndex = matchIndex;
    if (match.is_created == 0 || match.is_active == 0) {
      this.marketButton[matchIndex] = false;
    } else {
      this.marketButton[matchIndex] = true;
    }
    if (this.allSportsDetails[sportIndex]["seriesDetails"][seriesIndex]["matchDetails"][matchIndex]["marketDetails"]) {
      delete this.allSportsDetails[sportIndex]["seriesDetails"][seriesIndex]["matchDetails"][matchIndex]["marketDetails"];
    } else {
      let param = {
        "match_id": match.match_id,
        "sport_id": sport,
        "user_id": this.child_user_id == undefined ? this.userDetail._id : this.child_user_id
      }
      if (this.isSocket != 1) {
        this.sportservice.getOnlineMarket(param).subscribe((res) => {
          if (res.status == true) {
            if(this.searchMatch[seriesIndex] == ''){
              this.allSportsDetails[sportIndex]["seriesDetails"][seriesIndex]["matchDetails"][matchIndex]["marketDetails"] = res.data;
            }else{
              this.allSportsDetails[sportIndex]["seriesDetails"][seriesIndex]["matchDetails"].forEach((element,index) => {
                if(element.match_id ==match.match_id){
                  this.allSportsDetails[sportIndex]["seriesDetails"][seriesIndex]["matchDetails"][index]["marketDetails"] = res.data;
                  
                }
              });
            }
            
            this.cdRef.detectChanges();
            this.marketList = res.data;

            this.toastr.success(res.msg,'',{
              positionClass: 'toast-bottom-right',
              timeOut:1000
             });
          } else {
            this.toastr.error(res.msg, '', {
              timeOut: 10000,
            });
          }
        })
      }
      else {
        // this.socketEmitEvent('get-online-market', param);
      }
    }
  }
  updateMarketStatus(event, market, sportIndex, seriesIndex, matchIndex, marketIndex) {
    if (market.is_created == 0) {
      this.marketData = {
        "sport_id": market.sport_id,
        "series_id": market.series_id,
        "match_id": market.match_id,
        "market_id": market.market_id,
        "market_name": market.name,
        "is_manual": 0
      };
      this.sportservice.createMarket(this.marketData).subscribe((res) => {
        if (res.status == true) {

          this.toastr.success(res.msg,'',{
            positionClass: 'toast-bottom-right',
            timeOut:1000
           })
          this.allSportsDetails[sportIndex]["seriesDetails"][seriesIndex]["matchDetails"][matchIndex]["marketDetails"][marketIndex].is_active = 1;
          this.allSportsDetails[sportIndex]["seriesDetails"][seriesIndex]["matchDetails"][matchIndex]["marketDetails"][marketIndex].is_created = 1;
         
        } else {
          this.toastr.error(res.msg, '', {
            timeOut: 10000,
          });
        }
      })
    } else {
      if (this.child_user_id == undefined) {
        this.updateStatus = {
          "market_id": market.market_id,
          "is_active": market.is_active == 1 ? 0 : 1
        }
      } else {
        this.updateStatus = {
          "user_id": this.child_user_id,
          "market_id": market.market_id,
          "is_active": market.is_active == 1 ? 0 : 1
        }
      }
      this.sportservice.updateMarketStatus(this.updateStatus).subscribe((res) => {
        if (res.status == true) {
          if (this.updateStatus.is_active == 1){
            this.allSportsDetails[sportIndex]["seriesDetails"][seriesIndex]["matchDetails"][matchIndex]["marketDetails"][marketIndex].is_active = 1;
           
          }else{
            this.allSportsDetails[sportIndex]["seriesDetails"][seriesIndex]["matchDetails"][matchIndex]["marketDetails"][marketIndex].is_active = 0;
           
          }
          this.toastr.success(res.msg,'',{
            positionClass: 'toast-bottom-right',
            timeOut:1000
           });
        } else {
          this.toastr.error(res.msg, '', {
            timeOut: 10000,
          });
        }
      })
    }
  }

  
  openModalSportSetting(sportSetting: TemplateRef<any>, user,id,type) {
    this.showSelectedUserName = user.user_name;
    this.selectedUserId = user._id;
    this.Id = id;
    this.type = type
    // this.getUserSportsWiseSettingDetails(user._id,user.userSettingSportsWise,user)
    this.modalRef = this.modalService.show(
      sportSetting,
      Object.assign({}, { class: 'sportSetting-modal modal-lg' })
    );
  }

  applyValidationToFormGroup(formGroupName, jsonArrayName) {
    this.appValidationService.applyValidationRulesToFromGroup(formGroupName, jsonArrayName).then((validators) => {
    }).catch(() => { })
  }
  // getUserSportsWiseSettingDetails(user_id,settingId,user) {
  //   if (this.isSocket != 1) {
  //     this.usersService.getSportSetting({ 'user_id': user_id, '_id': this.userDetail.userSettingSportsWise }).subscribe(result => {
  //      this.specificUserDetails = result.data.sports_settings;
  //       if(result.data.sports_settings.length !== result.data.parent_sports_settings.length){
  //         this.specificUserParentDetails=[]
  //         this.specificUserDetails.forEach((element,index )=> {
            
  //           this.specificUserParentDetails.push(result.data.parent_sports_settings[0])
  //         });
  //       }else{
  //         this.specificUserParentDetails=result.data.parent_sports_settings
  //       }
  //       this.createSportsSettingArray(user)
  //     })
  //   }
  //   else {
  //     this.socketEmitEvent('get-user-sports-wise-setting-details', { userid: user_id });
  //   }
  // }

  // updateSportWiseSettingDetails(sport, sportIndex) {
  //   let compareResult = this.objectsAreSame(this.sportsForm.controls.sports_settings.value[sportIndex], this.specificUserDetails[sportIndex])
  //   if (!compareResult.objectsAreSame) {
  //     // compareResult.differentValueObject['sport_id'] = this.sportsForm.controls.sports_settings.value[sportIndex].sport_id
  //     // compareResult.differentValueObject['sport'] = this.sportsForm.controls.sports_settings.value[sportIndex].sport
  //     // compareResult.differentValueObject['name'] = this.sportsForm.controls.sports_settings.value[sportIndex].name
  //     let filteredSports_settings = []
  //     filteredSports_settings.push(compareResult.differentValueObject);
  //     let data = {
  //       user_id: this.selectedUserId,
  //       sports_settings_id: this.sportsForm.controls.sports_settings.value[sportIndex]._id,
  //       sports_settings: filteredSports_settings
  //     }
  //     if (this.sportsForm.invalid) {
  //       return
  //     }


  //     if (this.isSocket != 1) {
  //       this.usersService.updateSportWiseSettingDetails(data).subscribe(result => {
  //         if (result.status == true) {

  //           this.toastr.success(result.msg,'',{
  //             positionClass: 'toast-bottom-right',
  //             timeOut:1000
  //            });
  //           // this.modalService.hide()
  //         } else {
  //           this.toastr.error(result.msg, '', {
  //             timeOut: 10000,
  //           });
  //         }
  //       })
  //     }
  //     else {
  //       this.socketEmitEvent('update-sport-wise-setting-details', data);
  //     }
  //   } else {
  //     this.toastr.error("Same Data Found. Plz update it", '', {
  //       timeOut: 10000,
  //     })
  //   }
  // }

  selectPill(i) {
    this.selectedIndex = i;
  }

  enableFancy(matchData,seriesData,sportIndex,seriesIndex,matchIndex) {
    let data = {
      'match_id': matchData.match_id,
      'enable_fancy': matchData.enable_fancy == 1 ? 0 : 1
    };
    this.sportservice.enableFancy(data).subscribe((res) => {
      if(res.status == true){
        if(res.msg =="Fancy is enable successfully..."){
          this.allSportsDetails[sportIndex]["seriesDetails"][seriesIndex]["matchDetails"][matchIndex].enable_fancy = 1;
        }else if(res.msg =="Fancy is disable successfully..."){
          this.allSportsDetails[sportIndex]["seriesDetails"][seriesIndex]["matchDetails"][matchIndex].enable_fancy = 0;
        }
       
        this.toastr.success(res.msg,'',{
          positionClass: 'toast-bottom-right',
          timeOut:1000
         });
        //this.getOnlineMatchDetails(matchData.sport_id,seriesData,sportindex,seriesindex)
      } else {
        this.toastr.error(res.msg)
      }
    })
  }

  matchDetail(matchData) {
    localStorage.setItem('seriesButton', JSON.stringify( this.seriesButton));
    localStorage.setItem('matchButton', JSON.stringify( this.matchButton));
    
    localStorage.setItem('allSportsDetails', JSON.stringify( this.allSportsDetails));
    localStorage.setItem('matchData', JSON.stringify(matchData));
    this.router.navigate(['match-detail']);
  }

  getMarketLimits(id,type){
    this.popUpHead = id.name;
    this.specificUserDetails = [];
    this.sessionSetting = false;
    let data ;
    if(type == 0){
      data = {
        sport_id : id.sport_id
      }
      this.sessionSetting = true;
    } else if(type == 1){
      data = {
        series_id : id.series_id
      }
      this.sessionSetting = true;
    } else if(type == 2){
      data = {
        match_id : id.match_id
      }
      this.sessionSetting = true;
    } else if(type == 3){
      data = {
        market_id : id.market_id
      }
      this.sessionSetting = false;
    }
    this.sportservice.getMarketSetting(data).subscribe((res) => {
      if(res.status == true){
        let data =  res.data.limites
        this.sportsSettingValues = res.data.validations;
        if(type == 0 && data.sport_id == '4'){
          this.sessionSetting = true;
        } else if(type == 1 && data.sport_id == '4'){
          this.sessionSetting = true;
        } else if(type == 2 && data.sport_id == '4'){
          this.sessionSetting = true;
        } else {
          this.sessionSetting = false;
        }
        this.specificUserDetails.push(data)
        this.createSportsSettingArray()
      }
    })
  }
  get sportsSettingsFormArr(): FormArray {
    return this.sportsForm.get('sports_settings') as FormArray;
  }
  createSportsSettingArray() {
    this.sportsForm.get('sports_settings')['controls'] = []
   
    this.specificUserDetails.forEach((sport, index) => {
      if(this.type != 3){
        this.sportsSettingsFormArr.push(
          this.fb.group({
            sport_id: sport.sport_id,
            market_min_stack: [sport.market_min_stack, Validators.required],
            market_max_stack: [sport.market_max_stack, Validators.required],
            market_max_profit: [sport.market_max_profit, Validators.required],
            market_min_odds_rate: [sport.market_min_odds_rate, Validators.required],
            market_max_odds_rate: [sport.market_max_odds_rate, Validators.required],
            market_advance_bet_stake: [sport.market_advance_bet_stake, Validators.required],
            session_min_stack: [sport.session_min_stack, Validators.required],
            session_max_stack: [sport.session_max_stack, Validators.required],
            session_max_profit: [sport.session_max_profit, Validators.required]
          })
        );
      }else{
        this.sportsSettingsFormArr.push(
          this.fb.group({
            sport_id: sport.sport_id,
            market_min_stack: [sport.market_min_stack, Validators.required],
            market_max_stack: [sport.market_max_stack, Validators.required],
            market_max_profit: [sport.market_max_profit, Validators.required],
            market_min_odds_rate: [sport.market_min_odds_rate, Validators.required],
            market_max_odds_rate: [sport.market_max_odds_rate, Validators.required],
            market_advance_bet_stake: [sport.market_advance_bet_stake, Validators.required],
           
          })
        );
      }
    
      this.sportsSettingsFormArr.controls.forEach((sport, index) => {
        for (const key in this.sportsSettingsFormArr.controls[index]['controls']) {
          this.sportsSettingsFormArr.controls[index].get(key).clearValidators();
          this.sportsSettingsFormArr.controls[index].get(key).updateValueAndValidity();
      }
      });
      //Min. Stake Amount validation
       this.sportsSettingsFormArr.controls[index]['controls'].market_min_stack.setValidators([
         ValidatorControls.requiredValidator("Market Min Stack is required"), 
         ValidatorControls.minValueValidator(this.sportsSettingValues.market_min_stack, true, "Market Min Stack value should not be less than "+this.sportsSettingValues.market_min_stack, false),
         ValidatorControls.maxValueValidator(this.sportsSettingsFormArr.controls[index]['controls'].market_max_stack.value, true, "Market Min Stack value should not be greater than Market Max Stack")
        ])

        this.sportsSettingsFormArr.controls[index]['controls'].market_max_stack.setValidators([ValidatorControls.requiredValidator("Market Max Stack is required"), 
        ValidatorControls.minValueValidator(this.sportsSettingsFormArr.controls[index]['controls'].market_min_stack.value, true, "Market Max Stack value should not be less than Market Min Stack", false),
        ValidatorControls.maxValueValidator(this.sportsSettingValues.market_max_stack_max_limit, true, "Market Max Stack value should not be greater than "+this.sportsSettingValues.market_max_stack_max_limit)
        ])
      
       this.sportsSettingsFormArr.controls[index]['controls'].market_min_odds_rate.setValidators([ValidatorControls.requiredValidator("Market Min odds rate is required"),
        ValidatorControls.minValueValidator(this.sportsSettingValues.market_min_odds_rate, true, "Market Min odds rate value should not be less than "+this.sportsSettingValues.market_min_odds_rate, false)
      ])

       this.sportsSettingsFormArr.controls[index]['controls'].market_max_odds_rate.setValidators([ValidatorControls.requiredValidator("Market Max odds rate is required"), 
       ValidatorControls.minValueValidator(this.sportsSettingsFormArr.controls[index]['controls'].market_min_odds_rate.value, true, "Market Max odds rate value should not be less than Market Min odds rate", false),
        ValidatorControls.maxValueValidator(this.sportsSettingValues.market_max_odds_rate, true, "Market Max odds rate value should not be greater than "+this.sportsSettingValues.market_max_odds_rate)
      ])

       this.sportsSettingsFormArr.controls[index]['controls'].market_max_profit.setValidators([ValidatorControls.requiredValidator("Market Max profit is required"), 
       ValidatorControls.minValueValidator(1, true, "Market Max profit value should not be less than or equal to 0 ", false),
       ValidatorControls.maxValueValidator(this.sportsSettingValues.market_max_profit_max_limit, true, "Market Max profit value should not be greater than "+this.sportsSettingValues.market_max_profit_max_limit)
      ])

       this.sportsSettingsFormArr.controls[index]['controls'].market_advance_bet_stake.setValidators([ValidatorControls.requiredValidator("Before Inplay Match Stake is required"),
       ValidatorControls.minValueValidator(this.sportsSettingValues.market_advance_bet_stake_min_limit, true, "Before Inplay Match Stake value should not be less than or equal to "+this.sportsSettingValues.market_advance_bet_stake_min_limit, false),
        ValidatorControls.maxValueValidator(this.sportsSettingValues.market_advance_bet_stake_max_limit, true, "Before Inplay Match Stake value should not be greater than "+this.sportsSettingValues.market_advance_bet_stake_max_limit)
      ])

      //  this.sportsSettingsFormArr.controls[index]['controls'].market_bet_delay.setValidators([ValidatorControls.requiredValidator("Match Bets Delay is required"), 
      //  ValidatorControls.minValueValidator(this.sportsSettingValues.market_bet_delay, true, "Match Bets Delay value should not be less than parent value", false),
      //  ValidatorControls.maxValueValidator(10, true, "Match Bets Delay value should not be more than 10")
      // ])
      if(this.type != 3){
       this.sportsSettingsFormArr.controls[index]['controls'].session_min_stack.setValidators([ValidatorControls.requiredValidator("Min. Stake Amount  is required"),
        ValidatorControls.minValueValidator(this.sportsSettingValues.session_min_stack, true, "Min. Stake Amount value should not be less than parent value", false)
      ])

      this.sportsSettingsFormArr.controls[index]['controls'].session_max_stack.setValidators([ValidatorControls.requiredValidator("Max. Stake Amount is required"),
       ValidatorControls.minValueValidator(this.sportsSettingsFormArr.controls[index]['controls'].session_min_stack.value, true, "Max. Stake Amount value should not be less than min Stake Amount value", false),
       ValidatorControls.maxValueValidator(this.sportsSettingValues.session_max_stack_max_limit, true, "Max. Stake Amount value should not be greater than "+this.sportsSettingValues.session_max_stack_max_limit)
      ])

      this.sportsSettingsFormArr.controls[index]['controls'].session_max_profit.setValidators([ValidatorControls.requiredValidator("Session Max Profit is required"),
      ValidatorControls.minValueValidator(1, true, "Session Max Profit value should not be less than or equal to 0 ", false),
       ValidatorControls.maxValueValidator(this.sportsSettingValues.session_max_profit_max_limit, true, "Session Max Profit value should not be greater than "+this.sportsSettingValues.session_max_profit_max_limit)
      ])
    }
      // this.hiddenpass.push(true)

    });
    // this.sportsSettingsFormArr.controls.forEach((element, index) => {
    //   this.applyValidationToFormGroup(this.sportsSettingsFormArr.controls[index], "sportsSettings")
    // });

  }

  updateMarketSetting(sport, sportIndex) {
    let compareResult = this.objectsAreSame(this.sportsForm.controls.sports_settings.value[sportIndex], this.specificUserDetails[sportIndex])
    if (!compareResult.objectsAreSame) {
      // compareResult.differentValueObject['sport_id'] = this.sportsForm.controls.sports_settings.value[sportIndex].sport_id
      // compareResult.differentValueObject['sport'] = this.sportsForm.controls.sports_settings.value[sportIndex].sport
      // compareResult.differentValueObject['name'] = this.sportsForm.controls.sports_settings.value[sportIndex].name
      let filteredSports_settings = []
      filteredSports_settings.push(compareResult.differentValueObject);
      let data ;
      data = {
        sport_id : this.type == 0 ? this.Id : '',
        series_id : this.type == 1 ? this.Id : '',
        match_id : this.type == 2 ? this.Id : '',
        market_id : this.type == 3 ? this.Id : '',
        values: filteredSports_settings[0]
      }
      if(data.sport_id == ''){
        delete data.sport_id
      }
      if(data.series_id == ''){
        delete data.series_id
      }
      if(data.match_id == ''){
        delete data.match_id
      }
      if(data.market_id == ''){
        delete data.market_id
      }
      if (this.sportsForm.invalid) {
        return
      }


      if (this.isSocket != 1) {
        this.sportservice.updateMarketSetting(data).subscribe(result => {
          if (result.status == true) {

            this.toastr.success(result.msg,'',{
              positionClass: 'toast-bottom-right',
              timeOut:1000
             });
             this.modalService.hide()
          } else {
            this.toastr.error(result.msg, '', {
              timeOut: 10000,
            });
          }
        })
      }
      else {
        // this.socketEmitEvent('update-sport-wise-setting-details', data);
      }
    } else {
      this.toastr.error("Same Data Found. Plz update it", '', {
        timeOut: 10000,
      })
    }
  }

  objectsAreSame(x, y) {
    let differentValueObject = {}
    let objectsAreSame = true;
    for (let propertyName in x) {
      if (x[propertyName] !== y[propertyName]) {
        objectsAreSame = false;
        differentValueObject[propertyName] = x[propertyName]
      }
    }
    return {
      'objectsAreSame': objectsAreSame,
      'differentValueObject': differentValueObject
    };
  }

   applyValidatorsForMaxStack(index){
      this.sportsSettingsFormArr.controls[index]['controls'].market_max_stack.setValidators([ValidatorControls.requiredValidator("Market Max Stack is required"), 
      ValidatorControls.minValueValidator(this.sportsSettingsFormArr.controls[index]['controls'].market_min_stack.value, true, "Market Max Stack value should not be less than Market Min Stack", false), 
      ValidatorControls.maxValueValidator(this.sportsSettingValues.market_max_stack_max_limit, true, "Max. Stake Amount value should not be greater than "+this.sportsSettingValues.market_max_stack_max_limit)])
    this.sportsSettingsFormArr.controls[index]['controls'].market_max_stack.updateValueAndValidity();
    
  }

  applyValidatorsForMaxOddsRate(index){
    this.sportsSettingsFormArr.controls[index]['controls'].market_max_odds_rate.setValidators([ValidatorControls.requiredValidator("Market Max odds rate is required"), 
    ValidatorControls.minValueValidator(this.sportsSettingsFormArr.controls[index]['controls'].market_min_odds_rate.value, true, "Market Max odds rate value should not be less than Market Min odds rate", false),
   ValidatorControls.maxValueValidator(this.sportsSettingValues.market_max_odds_rate, true, "Market Max odds rate value should not be greater than "+this.sportsSettingValues.market_max_odds_rate)
  ])
    this.sportsSettingsFormArr.controls[index]['controls'].market_max_odds_rate.updateValueAndValidity();
   
  }

  applyValidatorsForMaxstake(index){
    this.sportsSettingsFormArr.controls[index]['controls'].session_max_stack.setValidators([ValidatorControls.requiredValidator("Max. Stake Amount is required"), 
    ValidatorControls.minValueValidator(this.sportsSettingsFormArr.controls[index]['controls'].session_min_stack.value, true, "Max. Stake Amount value should not be less than min Stake Amount value", false), 
    ValidatorControls.maxValueValidator(this.sportsSettingValues.session_max_stack_max_limit, true, "Max. Stake Amount value should not be greater than "+this.sportsSettingValues.session_max_stack_max_limit)
  ])
    this.sportsSettingsFormArr.controls[index]['controls'].session_max_stack.updateValueAndValidity();
  }
  updateLimit(id, type,lock,sportIndex,seriesIndex,matchIndex,marketIndex?:number) {
    let data;
    if (type == 1) {
      data = {
        "match_id": id,
        "values": {
          "is_lock": lock == false ? true : false
        }
      }
    } else if (type == 2) {
      data = {
        "market_id": id,
        "values": {
          "is_lock": lock == false ? true : false
        }
      }
    } else if (type == 3) {
      data = {
        "fancy_id": id,
        "values": {
          "is_lock": lock == false ? true : false
        }
      }
    }
    this.sportservice.updateMarketSetting(data).subscribe((res) => {
      if(res.status == true){
        if(matchIndex != undefined){
        this.allSportsDetails[sportIndex]["seriesDetails"][seriesIndex]["matchDetails"][matchIndex].is_lock=!this.allSportsDetails[sportIndex]["seriesDetails"][seriesIndex]["matchDetails"][matchIndex].is_lock
        }
        if(marketIndex != undefined){
          this.allSportsDetails[sportIndex]["seriesDetails"][seriesIndex]["matchDetails"][matchIndex]["marketDetails"][marketIndex].is_lock = !this.allSportsDetails[sportIndex]["seriesDetails"][seriesIndex]["matchDetails"][matchIndex]["marketDetails"][marketIndex].is_lock;
        }

         if(marketIndex == undefined){
          let marketDetails =this.allSportsDetails[sportIndex]["seriesDetails"][seriesIndex]["matchDetails"][matchIndex]["marketDetails"]
          marketDetails.forEach((element,index) => {
            this.allSportsDetails[sportIndex]["seriesDetails"][seriesIndex]["matchDetails"][matchIndex]["marketDetails"][index].is_lock=this.allSportsDetails[sportIndex]["seriesDetails"][seriesIndex]["matchDetails"][matchIndex].is_lock
          });
         }
        this.toastr.success(res.msg,'',{
          positionClass: 'toast-bottom-right',
          timeOut:3000
         });
         if(type == 1){
          // this.router.navigate(['dashboard'])
         } else if(type == 2){
          // this.getMatchDetail();
         } else if(type == 3){
          // this.showFancy();
         }
      } else {
        this.toastr.error(res.msg, '', {
          timeOut: 10000,
        });
      }
      
    })
  }

  updateInplayStatus(id, status,sportIndex,seriesIndex,matchIndex) {
    let data;
      data = {
        "match_id": id,
        "values": {
          "inplay": status == false ? true : false
        }
      }
    this.sportservice.updateMarketSetting(data).subscribe((res) => {
      if(res.status == true){
        if(matchIndex != undefined){
          this.allSportsDetails[sportIndex]["seriesDetails"][seriesIndex]["matchDetails"][matchIndex].inplay=!this.allSportsDetails[sportIndex]["seriesDetails"][seriesIndex]["matchDetails"][matchIndex].inplay
          }
        this.toastr.success(res.msg,'',{
          positionClass: 'toast-bottom-right',
          timeOut:3000
         });
      } else {
        this.toastr.error(res.msg, '', {
          timeOut: 10000,
        });
      }
      
    })
  }

  blockVisible(item,data,sportindex,seriesINdex?:number,matchINdex?:number,marketINdex?:number){
    if (item == 'sport') {
      this.blockVisibleItem = {
        "event": "sport",
        "filter": {
          "sport_id": data.sport_id
        },
        "update": {
          "is_visible": data.is_visible == true ? false : true
        }
      }
    } else if (item == 'series') {
      this.blockVisibleItem = {
        "event": "series",
        "filter": {
          "series_id": data.series_id
        },
        "update": {
          "is_visible": data.is_visible  == true ? false : true
        }
      }
    } else if (item == 'match') {
      this.blockVisibleItem = {
        "event": "match",
        "filter": {
          "match_id": data.match_id
        },
        "update": {
          "is_visible": data.is_visible  == true ? false : true
        }
      }
    } else if (item == 'market') {
      this.blockVisibleItem = {
        "event": "market",
        "filter": {
          "market_id": data.market_id
        },
        "update": {
          "is_visible": data.is_visible  == true ? false : true
        }
      }
    } 
    console.log("1231",this.blockVisibleItem)
    this.sportservice.visible(this.blockVisibleItem).subscribe((res) => {
      console.log("1233",res);
      if(res.status == true){
        if (item == 'sport') {
          //this.getAllSports()
          this.allSportsDetails[sportindex].is_visible=this.blockVisibleItem.update.is_visible;
          if(this.allSportsDetails[sportindex]["seriesDetails"]){
            this.allSportsDetails[sportindex]["seriesDetails"].forEach(
              function iter(a,index) {
                      a.is_visible =this.blockVisibleItem.update.is_visible;
                      if(a.matchDetails){
                        delete a.matchDetails
                      }
              }.bind(this)
          );
          }
         
        
      } else if (item == 'series') {
        this.allSportsDetails[sportindex]["seriesDetails"][seriesINdex].is_visible=this.blockVisibleItem.update.is_visible;
        if(this.allSportsDetails[sportindex]["seriesDetails"][seriesINdex]["matchDetails"]){
        this.allSportsDetails[sportindex]["seriesDetails"][seriesINdex]["matchDetails"].forEach(
          function iter(a) {
                  a.is_visible = this.blockVisibleItem.update.is_visible;
                  if(a.marketDetails){
                    delete a.marketDetails
                  }
          }.bind(this)
      );
        }
       
      } else if (item == 'match') {
        this.allSportsDetails[sportindex]["seriesDetails"][seriesINdex]["matchDetails"][matchINdex].is_visible=this.blockVisibleItem.update.is_visible;
        if(this.allSportsDetails[sportindex]["seriesDetails"][seriesINdex]["matchDetails"][matchINdex]["marketDetails"]){
        this.allSportsDetails[sportindex]["seriesDetails"][seriesINdex]["matchDetails"][matchINdex]["marketDetails"].forEach(
          function iter(a) {
                  a.is_visible = this.blockVisibleItem.update.is_visible;
              
          }.bind(this)
      );
        }
        
      } else if (item == 'market') {
        this.allSportsDetails[sportindex]["seriesDetails"][seriesINdex]["matchDetails"][matchINdex]["marketDetails"][marketINdex].is_visible=this.blockVisibleItem.update.is_visible;
      
      }
        this.toastr.success(res.data,'',{
          positionClass: 'toast-bottom-right',
          timeOut:3000
         });
      } else {
      
        this.toastr.error(res.data, '', {
          timeOut: 10000,
        });
      }
    })
  }

  callTv(event, id) {
    let data = {
      event: "match",
      filter: { match_id: id },
      update: { match_tv_url: this.tvUrl }
    }
    this.sportservice.visible(data).subscribe((res) => {
      console.log("1300", res);
      if(res.status == true){
        this.toastr.success(res.data,'',{
          positionClass: 'toast-bottom-right',
          timeOut:3000
         });
         this.tvUrl = ''
      } else {
        this.toastr.error(res.data, '', {
          timeOut: 10000,
        });
      }
    })
  }
}

