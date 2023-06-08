import { Component, OnInit, TemplateRef, OnDestroy ,ChangeDetectorRef,ChangeDetectionStrategy,} from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders, HttpHeaderResponse, HttpParams } from '@angular/common/http';
import { resolve } from 'q';
import { ToastrService } from 'ngx-toastr';
import { SportService } from '../services/sport.service';
import { LoginService } from '../services/login.service'
import { SocketServiceService } from '../services/socket-service.service';
import { CookieService } from 'ngx-cookie-service';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppValidationService } from '../app-validation/app-validation.service';
import { ValidatorControls } from '../app-validation/validation-controls.directive';
import { HeaderComponent } from '../header/header.component';
// import * as this.sportsSettingValues from './sport-stack-values.json'
import * as moment from 'moment';
const _ = require("lodash");
import { ClipboardService } from 'ngx-clipboard';
import * as e from 'express';
@Component({
  selector: 'app-match-detail',
  templateUrl: './match-detail.component.html',
  styleUrls: ['./match-detail.component.scss'],
  providers: [HeaderComponent],
})
export class MatchDetailComponent implements OnInit, OnDestroy {
  modalRef: BsModalRef;
  modalRef1: BsModalRef;
  public matchDetail: any;
  matchDetailLength: number;
  activeBetTab: string = 'all';
  betData: any;
  initialBetData: any
  matchedBets: any;
  fancyBets: any;
  moment: any = moment;
  fancy: any = [];
  adminDetails: any;
  userPosition: any;
  teamName: any;
  ownParentData: any;
  ownData: string[];
  fancyList: any;
  timer: any;
  allBetTimer: any;
  matchBetTimer: any;
  fancyBetTimer: any;
  deleteBetTimer: any;
  isSocket: number ;
  user_id: string;
  type: any;
  liveTv: string;
  graphicTv: string;
  liveUrl: SafeResourceUrl;
  graphicTvUrl: SafeResourceUrl;
  match_id: any;
  matchData: any;
  matchName: any;
  matchDate: any;
  tv: boolean = false;
  graph: boolean = false;
  score: boolean;
  scoreData: any;
  scoreLength: any;
  scoreBoard: any;
  callingType = 1;
  callingFancyType = 1;
  detailCalling = 1 ;
  perball: any;
  matchLength: any;
  contenCopied = false;
  userId: any;
  //sports related parameters
  homeData: any;
  userData: any;
  runnerData: any;
  firstData: any;
  parameter: any;
  a: any = [];
  total_Column_name: any = [];
  teamPositionData: any;
  displayTooltip: boolean;
  objectId: any;
  popbetData: any;
  intialPopbetData: any;
  market_id: any;
  userName: any;
  selectionName: any;
  betType: any;
  bet: any = '';
  oddsRate: any;
  stakeAmount: any;
  deleteBetId: any;
  deleteBetUserId: any;
  betdataType: any = [];
  matchRunnerData: any;
  selectBetdataType: any;
  allBetUserName: any;
  allBetSelection: any;
  allBetRate: any;
  allBetStake: any;
  matchBetUserName: any;
  matchBetSelection: any;
  matchBetRate: any;
  matchBetStake: any;
  fancyBetUserName: any;
  fancyBetRate: any;
  fancyBetStake: any;
  fancyBetSelection: any;
  allBetplacedTime: any;
  deletedBets: any;
  transactionPassword: any
  showFancyList: boolean;
  betDataLength: any;
  matchedBetsLength: any;
  fancyBetsLength: any;
  deletedBetsLength: any;
  enableFancy: any;
  fancyPosData: any;
  selectedFancyMarket: any;
  is_fancy: any;
  fancyLiability: any;
  twenty: boolean;
  fancyResultInputValue: Array<any> = [];
  marketIds: any = [];
  marketRunnerData: any;
  matchDetailFirst: any;
  runnerObjectData: any = [];
  objectData: any;
  marketObjectData: any;
  sampleObjectData: any;
  itemsPerPage: number = 50;
  currentPage: number = 1;
  totalItems: number = 0;
  matchItemsPerPage: number = 50;
  matchcurrentPage: number = 1;
  matchtotal_items: number = 0;
  fancyItemsPerPage: number = 50;
  fancycurrentPage: number = 1;
  fancytotal_items: number = 0;
  deleteBetItemsPerPage: number = 50;
  deleteBetcurrentPage: number = 1;
  deleteBettotal_items: number = 0;
  currentPositionItemsPerPage: number = 50;
  currentPositioncurrentPage: number = 1;
  currentPositiontotal_items: number = 0;
  betPoupItemsPerPage: number = 50;
  betPoupcurrentPage: number = 1;
  betPouptotal_items: number = 0;
  betCallingType: any = 1;
  betTotalValue: any;
  selectedMarket: any;
  userDetails: any;
  team_name: any;
  parentData: any;
  column_name: any;
  totalData: any;
  parentId: any;
  loggedInUser: any;
  id: any;
  accountHolder: any;
  betsPopupMarketName: string;
  betTypeFilter: string = 'All';
  selectedFilter: string = "All"
  lock: any;
  sessionSetting: boolean;
  popUpHead: any;
  specificUserDetails = [];
  fancyDataArray = [];
  fancyArray: any;
  sportsSettingValues: any;
  sportsForm: FormGroup;
  showSelectedUserName: any;
  selectedUserId: any;
  Id: any;
  typeId: any;
  marketSetting: boolean;
  showSetting: boolean;
  check_event_limit: any;
  fancySetting: boolean;
  sessionSettingValues: any;
  matchBetCallingType: number;
  fancyBetCallingType: number;
  deleteBetCallingType: number;
  fancyBetLength: any;
  matchValue: boolean;
  fancyValue: boolean;
  deleteValue: boolean;
  messageData: string;
  betValue: boolean;
  betFancyTypeFilter: any;
  betsPopupFancyName: string;
  popBetData: boolean;
  fancyBetData: boolean;
  fancyRunnerData: any;
  primaryFancy: any;
  userParentName: any;
  parentList: any;
  showShare: boolean = false;
  // showShare: boolean = false;
  totalExpoData: any;
  allBetDomain: any;
  matchBetDomain: any;
  fancyBetDomain: any;
  marketId: any  = [];
  fancyId:any = [];
  marketData: any;
  socketData: any;
  fancyDta: any;
  createFancyType: number = 1;
  fancyTimer: any;
  marketPopupData: any;
  bookType: any;
  ukraine: any = 0;
  cuurency: string;
  constructor(public clipboardService: ClipboardService,private cdRef: ChangeDetectorRef,private loginService: LoginService, public sanitizer: DomSanitizer, private modalService: BsModalService, private router: Router, private http: HttpClient,
    public toastr: ToastrService, public sport: SportService, private cookie: CookieService, private socketService: SocketServiceService,
    private appValidationService: AppValidationService,private head: HeaderComponent, private fb: FormBuilder,) { }
    socketStatus(){
      this.sport.getSocketStatus().subscribe((res) => {
        this.isSocket = res.is_socket;
          this.socketService.setUpSocketConnection();
          this.socketListeners();
          this.socketError();
          this.socketSuccess();
          this.socketFancySuccess();
          this.getMatchDetail();
          this.matchData = JSON.parse(localStorage.getItem('matchData'));
          this.enableFancy = this.matchData.enable_fancy;
          // if(this.enableFancy == 1){
            this.showFancy();
          // }
      })
    }
  async ngOnInit() {
    this.adminDetails = JSON.parse(localStorage.getItem('adminDetails'));
    this.matchData = JSON.parse(localStorage.getItem('matchData'));
    this.remainMatchData()
    this.betdataType = ['All', 'Back', 'Lay'];
    this.match_id = this.matchData.match_id;
    this.matchName = this.matchData.match_name;
    this.sportsForm = this.fb.group({
      sports_settings: this.fb.array([])
    })
    this.myTeamPosition();
    this.getFancyLiability()
  } 
  remainMatchData(){
    let param = {
      match_id: this.matchData.match_id
    }
    this.sport.getHomeMatchesList(param).subscribe(res => {
      if (res.status) {
        this.matchData = res.data[0];
        localStorage.setItem('matchData',JSON.stringify(this.matchData));
        this.socketStatus();
    this.marketSettingApi(this.matchData.sport_id, this.matchData?.match_id)
    this.score = false;
    this.teamPositionData = {};
    this.myTeamPosition();
    this.matchDate = this.matchData.match_date;
    this.enableFancy = this.matchData.enable_fancy;
    this.lock = this.matchData.is_lock;
    if(this.matchData.inplay == true){
      if(this.matchData.match_tv_url == '' || this.matchData.match_tv_url == null){
        this.tv = false
      } else {
        this.tv = true;
        this.liveTv = this.matchData.match_tv_url;
        this.liveUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.liveTv);
      }
      if(this.matchData.match_scoreboard_url == '' || this.matchData.match_scoreboard_url == null){
        this.graph = false
      } else {
        this.graph = true;
        this.graphicTv = this.matchData.match_scoreboard_url;
        this.graphicTvUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.graphicTv);
      }
    }
    // this.getMyBets( this.currentPage);
    this.user_id = localStorage.getItem('userId');
    this.type = this.adminDetails.user_type_id;
      } else {
        this.socketStatus();
        this.marketSettingApi(this.matchData.sport_id, this.matchData?.match_id)
        this.score = false;
        this.teamPositionData = {};
        this.myTeamPosition();
        this.matchDate = this.matchData.match_date;
        this.enableFancy = this.matchData.enable_fancy;
        this.lock = this.matchData.is_lock;
        if(this.matchData.inplay == true){
          if(this.matchData.match_tv_url == '' || this.matchData.match_tv_url == null){
            this.tv = false
          } else {
            this.tv = true;
            this.liveTv = this.matchData.match_tv_url;
            this.liveUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.liveTv);
          }
          if(this.matchData.match_scoreboard_url == '' || this.matchData.match_scoreboard_url == null){
            this.graph = false
          } else {
            this.graph = true;
            this.graphicTv = this.matchData.match_scoreboard_url;
            this.graphicTvUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.graphicTv);
          }
        }
        // this.getMyBets( this.currentPage);
        this.user_id = localStorage.getItem('userId');
        this.type = this.adminDetails.user_type_id;
      }
    }, (err) => {
      console.log(err);
    })
  }
  
  liveBet(data){
    if(data == 0){
      this.ukraine =  1;
      this.getMyBets(this.currentPage);
      this.cdRef.detectChanges();
    } else {
      this.ukraine =  0;
      this.betData = [];
      this.betValue = false;
      clearTimeout(this.allBetTimer);
      this.cdRef.detectChanges();
    }
  }
  marketSettingApi(sport_id, match_id) {
    let data = {
      "sport_id": sport_id,
      "match_id": match_id,
    };
    this.sport.getMarketSettingValues(data).subscribe((res) => {
      if (res.status == true) {
        this.check_event_limit = res.check_event_limit
        if (this.check_event_limit == true) {
          this.sportsSettingValues = res.data;
          this.sessionSettingValues = res.data.session;
          this.fancySetting = true;
        } else {
          // this.sessionSetting = res.data.session;
          this.sportsSettingValues = res.data.market;
          this.sessionSettingValues = res.data.session;
          this.fancySetting = false;
        }
        this.showSetting = true;
      } else {
        this.showSetting = false;
        if(res.logout == true){
          this.head.logoutUser();
        }
      }

    })
  }
  updateShareWise(status) {
    this.showShare = !status
  }
  updateCurrentPosition(status) {
    this.showShare = !status
  }
  getMatchDetail() {
    this.matchData = JSON.parse(localStorage.getItem('matchData'));
    let data = {
      "match_id": this.matchData.match_id
    }
    this.sport.matchDetails(data).subscribe((res) => {
      this.matchDetailFirst = res.data;
      this.matchDetailLength = res.data.length;
      if (this.check_event_limit == true) {
        for (let i = 0; i < this.matchDetailFirst.length; i++) {
          if (this.sportsSettingValues != undefined) {
            for (let j = 0; j < Object.keys(this.sportsSettingValues).length; j++) {
              if (this.matchDetailFirst[i].market_id == Object.keys(this.sportsSettingValues)[j]) {
                let key = Object.values(this.sportsSettingValues)[j]
                this.matchDetailFirst[i].min_stake = Object.values(this.sportsSettingValues)[j]['market_min_stack']
                this.matchDetailFirst[i].max_stake = Object.values(this.sportsSettingValues)[j]['market_max_stack']
                this.matchDetailFirst[i].max_profit = Object.values(this.sportsSettingValues)[j]['market_max_profit']
              }
            }
          }

        }
      } else {
        if (this.sportsSettingValues != undefined) {
          this.matchDetailFirst.forEach(matDta => {
            matDta.min_stake = this.sportsSettingValues.market_min_stack;
            matDta.max_stake = this.sportsSettingValues.market_max_stack;
            matDta.max_profit = this.sportsSettingValues.market_max_profit;
          });
        }
      }
      for (let i = 0; i < this.matchDetailFirst.length; i++) {
        this.matchDetailFirst[i].updateNews = this.matchDetailFirst[i].news == '' ? undefined : this.matchDetailFirst[i].news;
        for (let j = 0; j < this.matchDetailFirst[i].runners.length; j++) {
          this.sampleObjectData =
          {
            "availableToBack": [
              {
                "price": "--",
                "size": "--"
              },
              {
                "price": "--",
                "size": "--"
              },
              {
                "price": "--",
                "size": "--"
              }
            ],
            "availableToLay": [
              {
                "price": "--",
                "size": "--"
              },
              {
                "price": "--",
                "size": "--"
              },
              {
                "price": "--",
                "size": "--"
              }
            ]
          }
            ;
          this.matchDetailFirst[i].runners[j].ex = this.sampleObjectData;
        }
      }
      this.matchDetailFirst.forEach(matDta => {
        matDta.shadowRunner = matDta.runners;
      });
      this.matchDetail = this.matchDetailFirst;
      if (this.isSocket != 1) {
        this.matchRunner();
      } else {
        this.getRunnerEmit();
      }
      let matchOddds
      this.matchDetail.forEach((matDta, index) => {
        if (matDta.name == 'Match Odds') {
          matchOddds = this.matchDetail.splice(index, 1)
        }
      });
      this.matchDetail.unshift(matchOddds[0])
    }, (err) => {
      // this.scoreApi();
    },
      () => {
        if (this.router.url.split('?')[0] == '/match-detail') {
          // this.timer = setTimeout(() => resolve(this.getMatchDetail()), 10000);
        }
      })
  }

  matchRunner() {
    for (let i = 0; i < this.matchDetailFirst.length; i++) {
      let data = "ODDS_" + this.matchDetailFirst[i].market_id
      this.marketIds.push(data);
    }
    this.matchData = JSON.parse(localStorage.getItem('matchData'));
    let marketData = {
      "match_id": this.matchData.match_id,
      "marketIds": this.marketIds
    }
    this.sport.matchDetailRunners(marketData).subscribe((res) => {
      if (res.status) {
        this.marketIds = [];
        this.marketRunnerData = res.data;
        for (let i = 0; i < this.matchDetailFirst.length; i++) {
          this.matchDetailFirst[i].updateNews = this.matchDetailFirst[i].news == '' ? undefined : this.matchDetailFirst[i].news;
          for (let j = 0; j < this.marketRunnerData.length; j++) {
            if (this.matchDetailFirst[i].market_id == this.marketRunnerData[j].marketId) {
              for (let k = 0; k < this.matchDetailFirst[i].runners.length; k++) {
                for (let l = 0; l < this.marketRunnerData[j].runners.length; l++) {
                  if (this.matchDetailFirst[i].runners[k].selectionId == this.marketRunnerData[j].runners[l].selectionId) {
                    (this.marketRunnerData[j].runners[l].name) = (this.matchDetailFirst[i].runners[k].name);
                    (this.marketRunnerData[j].runners[l].win_loss) = (this.matchDetailFirst[i].runners[k].win_loss);
                  }
                }
              }
              break
            } else {
              this.marketObjectData = [];
              this.objectData = [];
              this.runnerObjectData = []
              for (let k = 0; k < this.matchDetailFirst[i].runners.length; k++) {
                this.objectData = {
                  "selectionId": this.matchDetailFirst[i].runners[k].selectionId,
                  "name": this.matchDetailFirst[i].runners[k].name,
                  "selection_name": this.matchDetailFirst[i].runners[k].selection_name,
                  "win_loss": this.matchDetailFirst[i].runners[k].win_loss,
                  "status": "SUSPENDED",
                  "ex": {
                    "availableToBack": [
                      {
                        "price": '--',
                        "size": '--'
                      },
                      {
                        "price": '--',
                        "size": '--'
                      },
                      {
                        "price": '--',
                        "size": '--'
                      }
                    ],
                    "availableToLay": [
                      {
                        "price": '--',
                        "size": '--'
                      },
                      {
                        "price": '--',
                        "size": '--'
                      },
                      {
                        "price": '--',
                        "size": '--'
                      }
                    ]
                  }
                }
                this.runnerObjectData.push(this.objectData)
              }
              this.marketObjectData = {
                "inplay": false,
                "marketId": this.matchDetailFirst[i].market_id,
                "runners": this.runnerObjectData,
                "status": "SUSPENDED",
              }
              const found = this.marketRunnerData.some(el => el.marketId === this.matchDetailFirst[i].market_id);
              if (!found) {
                this.marketRunnerData.push(this.marketObjectData);
              }
            }
          }
        }
        const a3 = this.matchDetailFirst.map(t1 => ({ ...t1, ...this.marketRunnerData.find(t2 => (t2.marketId === t1.market_id)) }));
        this.matchDetail = a3
        if (this.matchDetailLength != 0) {
          // this.inplayStatus = res.data[0].inplay;
          if (this.callingType == 1) {
            this.callingType = 2;
            this.matchDetailFirst.forEach(matDta => {
              matDta.shadowRunner = matDta.runners;
            });
            for (let i = 0; i < this.matchDetail.length; i++) {
              if (this.teamPositionData != undefined || this.teamPositionData != null || this.teamPositionData != '') {
                for (let j = 0; j < Object.keys(this.teamPositionData).length; j++) {
                  if (this.matchDetail[i].marketId == Object.keys(this.teamPositionData)[j]) {
                    for (let k = 0; k < this.matchDetail[i].runners.length; k++) {
                      let key = Object.values(this.teamPositionData)[j]
                      for (let l = 0; l < Object.keys(key).length; l++) {
                        if (this.matchDetail[i].runners[k].selectionId == key[l].selection_id) {
                          this.matchDetail[i].runners[k].win_loss = key[l].win_loss;
                          this.matchDetail[i].runners[k].win_loss_total_exposure = key[l].win_loss_total_exposure;
                        }
                      }
                    }
                  }
                }
              }

            }
          } else {
            for (let mDt = 0; mDt < this.matchDetailFirst.length; mDt++) {
              for (let runsIndex = 0; runsIndex < this.marketRunnerData.length; runsIndex++) {
                if (this.matchDetailFirst[mDt].market_id == this.marketRunnerData[runsIndex].marketId) {
                  this.matchDetailFirst[mDt]["shadowRunner"] = [];
                  for (let i = 0; i < this.matchDetailFirst[mDt].runners.length; i++) {
                    for (let j = 0; j < (this.matchDetailFirst[runsIndex].runners).length; j++) {
                      if (this.matchDetailFirst[mDt].runners[i].selectionId == this.marketRunnerData[runsIndex].runners[j].selectionId) {
                        this.matchDetailFirst[mDt].shadowRunner[i] = {};
                        this.matchDetailFirst[mDt].shadowRunner[i] = JSON.parse(JSON.stringify(this.matchDetailFirst[mDt].runners[i]));
                        this.matchDetailFirst[mDt].runners[i].ex = JSON.parse(JSON.stringify(this.marketRunnerData[runsIndex].runners[j].ex));
                      }
                    }
                  }

                }
              }
            }
            for (let i = 0; i < this.matchDetail.length; i++) {
              if (this.teamPositionData != undefined || this.teamPositionData != null || this.teamPositionData != '') {
                for (let j = 0; j < Object.keys(this.teamPositionData).length; j++) {
                  if (this.matchDetail[i].marketId == Object.keys(this.teamPositionData)[j]) {
                    for (let k = 0; k < this.matchDetail[i].runners.length; k++) {
                      let key = Object.values(this.teamPositionData)[j]
                      for (let l = 0; l < Object.keys(key).length; l++) {
                        if (this.matchDetail[i].runners[k].selectionId == key[l].selection_id) {
                          this.matchDetail[i].runners[k].win_loss = key[l].win_loss;
                          this.matchDetail[i].runners[k].win_loss_total_exposure = key[l].win_loss_total_exposure;
                        }
                      }
                    }
                  }
                }
              }

            }
          }
          let matchOddds
          this.matchDetail.forEach((matDta, index) => {
            if (matDta.name == 'Match Odds') {
              matchOddds = this.matchDetail.splice(index, 1)
            }
          });
          this.matchDetail.unshift(matchOddds[0])
        } else {
          console.log("No record found");

        }
      } else {
        this.marketIds = [];
        for (let i = 0; i < this.matchDetailFirst.length; i++) {
          this.matchDetailFirst[i].updateNews = this.matchDetailFirst[i].news == '' ? undefined : this.matchDetailFirst[i].news;
          for (let j = 0; j < this.matchDetailFirst[i].runners.length; j++) {
            this.sampleObjectData =
            {
              "availableToBack": [
                {
                  "price": "--",
                  "size": "--"
                },
                {
                  "price": "--",
                  "size": "--"
                },
                {
                  "price": "--",
                  "size": "--"
                }
              ],
              "availableToLay": [
                {
                  "price": "--",
                  "size": "--"
                },
                {
                  "price": "--",
                  "size": "--"
                },
                {
                  "price": "--",
                  "size": "--"
                }
              ]
            }
              ;
            this.matchDetailFirst[i].runners[j].ex = this.sampleObjectData;
          }
        }
        for (let i = 0; i < this.matchDetailFirst.length; i++) {
          if (this.teamPositionData != undefined || this.teamPositionData != null || this.teamPositionData != '') {
            for (let j = 0; j < Object.keys(this.teamPositionData).length; j++) {
              if (this.matchDetailFirst[i].market_id == Object.keys(this.teamPositionData)[j]) {
                for (let k = 0; k < this.matchDetailFirst[i].runners.length; k++) {
                  let key = Object.values(this.teamPositionData)[j]
                  for (let l = 0; l < Object.keys(key).length; l++) {
                    if (this.matchDetailFirst[i].runners[k].selectionId == key[l].selection_id) {
                      this.matchDetailFirst[i].runners[k].win_loss = key[l].win_loss;
                      this.matchDetail[i].runners[k].win_loss_total_exposure = key[l].win_loss_total_exposure;
                    }
                  }
                }
              }
            }
          }

        }
        this.matchDetailFirst.forEach(matDta => {
          matDta.shadowRunner = matDta.runners;
        });
        this.matchDetail = this.matchDetailFirst;
        console.log("645",this.matchDetail);
        
      }
    }, (err) => {
      // this.scoreApi();
    },
      () => {
        if (this.router.url.split('?')[0] == '/match-detail') {
          if(this.isSocket != 1){
            this.timer = setTimeout(() => resolve(this.matchRunner()), 1000);
          } else {
            clearTimeout(this.timer);
          }
          // this.timer = setTimeout(() => resolve(this.matchRunner()), 1000);
        }
      })
  }
  addClassWhenOddChange(newSize, oldSize, newPrice, oldPrice, i, type) {
    if ((newSize != "--" && oldSize != "--") || (newPrice != "--" && oldPrice != "--")) {
      if ((newSize != oldSize || newPrice != oldPrice)) {
        return 'backColorChange' + i;
      }

    }


  }

  openModalBets(bets: TemplateRef<any>, marketName: string) {
    this.userName = '';
    this.selectionName = '';
    this.betTypeFilter = 'All'
    this.oddsRate = '';
    this.stakeAmount = '';
    this.betPoupcurrentPage = 1
    this.betsPopupMarketName = marketName
    this.modalRef = this.modalService.show(
      bets,
      Object.assign({}, { class: 'bets-modal modal-lg' })
    );
  }
  openModalFancyBets(fancybets: TemplateRef<any>, marketName: string) {
    this.betsPopupFancyName = marketName
    this.modalRef = this.modalService.show(
      fancybets,
      Object.assign({}, { class: 'bets-modal ' })
    );
  }

  // openBookModal(book: TemplateRef<any>) {
  //   this.modalRef = this.modalService.show(
  //     book,
  //     Object.assign({}, { class: '' })
  //   );
  // }

  openModalMarketPosition(market,type, marketPosition: TemplateRef<any>) {
    this.selectedMarket = market
    this.modalRef1 = this.modalService.show(
      marketPosition,
      Object.assign({}, { class: 'bets-modal modal-lg' })
    );
    this.userpos('', market,type)
  }

  userpos(user_id, market,type) {
    this.id = user_id
    this.loggedInUser = JSON.parse(localStorage.getItem('adminDetails'))
    let data = {
      market_id: market.market_id,
      user_id: user_id == '' ?  this.adminDetails.user_id   : user_id
    }
    if (data.user_id == '') {
      delete data.user_id
    }
    if(type == 'masterBook'){
      data["master_book"] = true;
    } else {
      data['user_book'] = true;
    }
    if(data["master_book"] == true){
      delete data["master_book"] 
    }
    this.sport.marketPosition(data).subscribe((res) => {
      if (res.status == true) {
        this.userDetails = res.data.users;
        this.userDetails = _.orderBy(this.userDetails, ['user_name', 'user_type_id'], ['asc', 'desc']);
        this.team_name = res.data.metadata.teams;
        this.team_name = _.sortBy(this.team_name);
        this.parentData = res.data.metadata.parent;
        this.parentData = _.orderBy(this.parentData, ['selection_name'], ['asc']);
        this.ownData = res.data.metadata.own;
        this.ownData = _.orderBy(this.ownData, ['selection_name'], ['asc']);
        this.column_name = res.data.metadata.columns;
        this.column_name = _.sortBy(this.column_name);
        this.totalData = res.data.metadata.total;
        this.totalData = _.orderBy(this.totalData, ['selection_name'], ['asc']);
        this.totalExpoData = res.data.metadata.total_exposure;
        this.totalExpoData = _.orderBy(this.totalExpoData, ['selection_name'], ['asc']);
        this.parentId = res.parent_id;
        this.accountHolder = res.user_name;
        this.total_Column_name = [];
        for (let i = 0; i < this.column_name.length; i++) {
          let c = this.column_name[i] + '_total_exposure';
          this.total_Column_name.push(c);
        }
        this.total_Column_name = _.sortBy(this.total_Column_name);
      } else {
        if(res.logout == true){
          this.head.logoutUser();
        }
      }
    })
  }
  trackHero(index, runner) {
    return runner.matchId;
  }
  trackMatchdetails(index, runner) {
    return runner.match_id;
  }
  openModalAddMarket(addMarket: TemplateRef<any>) {
    this.homematches()
    this.modalRef = this.modalService.show(
      addMarket,
      Object.assign({}, { class: 'addMarket-modal modal-lg' })
    );
  }
  openModalSearchMarket(matchBet: TemplateRef<any>) {
    this.modalRef = this.modalService.show(
      matchBet,
      Object.assign({}, { class: 'matchBet-modal modal-lg' })
    );
  }
  openModaldeleteBet(deleteBet: TemplateRef<any>, betId, userId, isFancy) {
    this.deleteBetId = betId;
    this.deleteBetUserId = userId;
    this.is_fancy = isFancy;
    this.modalRef = this.modalService.show(
      deleteBet,
      Object.assign({}, { class: 'deleteBet-modal modal-lg' })
    );
  }

  deleteUserBet(bet, user, n, isFancy) {
    let param = {
      bet_id: bet,
      user_id: user,
      is_void: n == '1' ? true : false,
      "is_fancy": isFancy,
      "password": this.transactionPassword
    }
    this.sport.deleteBet(param).subscribe((res) => {
      if (res.status == true) {
        this.toastr.success(res.msg, '', {
          positionClass: 'toast-bottom-right',
          timeOut: 1000
        });
        this.getMyBets(this.currentPage);
        this.modalRef.hide();
      } else {
        this.toastr.error(res.msg, '', {
          timeOut: 10000,
        })
        if(res.logout == true){
          this.head.logoutUser();
        }
      }

    })
  }
  socketOnEvent(eventName, callback) {
    this.socketService.socket.on(eventName, data => callback(data));
  }

  socketEmitEvent(eventName, data) {
    this.socketService.socket.emit(eventName, data);
  }
  marketAdded(){
    this.userData = {};
    this.socketEmitEvent('new_market_added',this.userData);
  }
  fancyAdded(){
    this.userData = {};
    this.socketEmitEvent('fancy_added',this.userData);
  }
  socketError(){
    this.socketService.socket.on('error',(res) => {
      if(res.status == false){
        this.toastr.error(res.msg)
      }
    })
  }
  socketSuccess(){
    this.socketService.socket.on('success',(res) => {
      if(res.status == true){
        if (res.event_code == "subscribe_event") {
          for (let i = 0; i < this.marketId.length; i++) {
            this.socketOnEvent(this.marketId[i], result => {
              if (result.status == true) {
                if(result.is_fancy == false){
                  this.marketData = result.data;
                this.runnerData = this.marketData;
                for (let i = 0; i < this.matchDetailFirst.length; i++) {
                  // debugger
                  if (this.matchDetailFirst[i].market_id == this.runnerData.marketId) {
                    this.matchDetailFirst[i]["shadowRunner"] = [];
                    for(let j = 0;j < this.matchDetailFirst[i].runners.length;j++){
                       if(this.runnerData.runners.length != 0){
                        for(let k=0 ; k < this.runnerData.runners.length;k++){
                          if(this.matchDetail[i].runners[j].selectionId == this.runnerData.runners[k].selectionId){
                            this.matchDetail[i].runners[j].ex = this.runnerData.runners[k].ex;
                            this.matchDetail[i].runners[j].status = this.runnerData.runners[k].status;
                          } else {
                            // this.matchDetail[i].runners[j].ex.availableToBack= [];
                            // this.matchDetail[i].runners[j].ex.availableToLay= [];
                            // this.matchDetail[i].runners[j].status = 'SUSPENDED';
                          }
                        }
                      } else {
                          this.sampleObjectData =
                          {
                            "availableToBack": [
                              {
                                "price": "--",
                                "size": "--"
                              },
                              {
                                "price": "--",
                                "size": "--"
                              },
                              {
                                "price": "--",
                                "size": "--"
                              }
                            ],
                            "availableToLay": [
                              {
                                "price": "--",
                                "size": "--"
                              },
                              {
                                "price": "--",
                                "size": "--"
                              },
                              {
                                "price": "--",
                                "size": "--"
                              }
                            ]
                          }
                            ;
                          this.matchDetail[i].runners[j].ex = this.sampleObjectData;
                          // this.matchDetailFirst[i].runners[j].status = 'SUSPENDED';
                      }
                    }
                  }
                }
              //   for (let mDt = 0; mDt < this.matchDetailFirst.length; mDt++) {
              //     if (this.matchDetailFirst[mDt].market_id == this.runnerData.marketId) {
              //       this.matchDetailFirst[mDt]["shadowRunner"] = [];
              //       for (let i = 0; i < this.matchDetailFirst[mDt].runners.length; i++) {
              //         for (let j = 0; j < (this.runnerData.runners).length; j++) {
              //           if (this.matchDetailFirst[mDt].runners[i].selectionId == this.runnerData.runners[j].selectionId) {
              //             this.matchDetailFirst[mDt].shadowRunner[i] = {};
              //             this.matchDetailFirst[mDt].shadowRunner[i] = JSON.parse(JSON.stringify(this.matchDetailFirst[mDt].runners[i]));
              //             this.matchDetailFirst[mDt].runners[i].ex = JSON.parse(JSON.stringify(this.runnerData.runners[j].ex));
              //           }
              //         }
              //       }
  
              //     }
              // }
                for (let i = 0; i < this.matchDetail.length; i++) {
                  if (this.matchDetail[i].market_id == this.runnerData.marketId) {
                    this.matchDetail[i].status = this.runnerData.status;
                    this.matchDetail[i].inplay = this.runnerData.inplay;
                    if (this.runnerData.hasOwnProperty('matched')) {
                      if (this.runnerData.matched > 999 && this.runnerData.matched < 1000000) {
                        this.cuurency = (this.runnerData.matched / 1000).toFixed(1) + 'K'; // convert to K for number from > 1000 < 1 million 
                      } else if (this.runnerData.matched > 1000000) {
                        this.cuurency = (this.runnerData.matched / 1000000).toFixed(1) + 'M'; // convert to M for number from > 1 million 
                      } else if (this.runnerData.matched < 900) {
                        this.cuurency = this.runnerData.matched; // if value < 1000, nothing to do
                      }
                    } else {
                      this.cuurency = '0';
                    }
                    this.matchDetail[i].matched = this.cuurency;
                    for(let j = 0;j < this.matchDetail[i].runners.length;j++){
                      for(let k=0 ; k < this.runnerData.runners.length;k++){
                        if(this.matchDetail[i].runners[j].selectionId == this.runnerData.runners[k].selectionId){
                          this.matchDetail[i].runners[j].ex = this.runnerData.runners[k].ex;
                          this.matchDetail[i].runners[j].status = this.runnerData.runners[k].status;
                        }
                      }
                    }
                    break
                  }
                }
                for (let i = 0; i < this.matchDetail.length; i++) {
                  if (this.teamPositionData != undefined || this.teamPositionData != null || this.teamPositionData != '') {
                    for (let j = 0; j < Object.keys(this.teamPositionData).length; j++) {
                      if (this.matchDetail[i].market_id == Object.keys(this.teamPositionData)[j]) {
                        for (let k = 0; k < this.matchDetail[i].runners.length; k++) {
                          let key = Object.values(this.teamPositionData)[j]
                          for (let l = 0; l < Object.keys(key).length; l++) {
                            if (this.matchDetail[i].runners[k].selectionId == key[l].selection_id) {
                              this.matchDetail[i].runners[k].win_loss = key[l].win_loss;
                              this.matchDetail[i].runners[k].win_loss_total_exposure = key[l].win_loss_total_exposure;
                            }
                          }
                        }
                      }
                    }
                  }
                  for (let o = 0; o < this.matchDetail[i].runners.length; o++) {
                    if((this.matchDetail[i].runners[o].ex.availableToBack).length != 0){
                      for(let m=0; m <(this.matchDetail[i].runners[o].ex.availableToBack).length;m++){
                        if (this.matchDetail[i].runners[o].ex.availableToBack[m].size > 999 && this.matchDetail[i].runners[o].ex.availableToBack[m].size < 1000000) {
                          this.matchDetail[i].runners[o].ex.availableToBack[m].size = (this.matchDetail[i].runners[o].ex.availableToBack[m].size / 1000).toFixed(1) + 'K'; // convert to K for number from > 1000 < 1 million 
                        } else if (this.matchDetail[i].runners[o].ex.availableToBack[m].size > 1000000) {
                          this.matchDetail[i].runners[o].ex.availableToBack[m].size = (this.matchDetail[i].runners[o].ex.availableToBack[m].size / 1000000).toFixed(1) + 'M'; // convert to M for number from > 1 million 
                        } else if (this.matchDetail[i].runners[o].ex.availableToBack[m].size < 900) {
                          this.matchDetail[i].runners[o].ex.availableToBack[m].size = this.matchDetail[i].runners[o].ex.availableToBack[m].size; // if value < 1000, nothing to do
                        }
                      }
                    }
                    if((this.matchDetail[i].runners[o].ex.availableToLay).length != 0){
                      for(let n=0; n <(this.matchDetail[i].runners[o].ex.availableToLay).length;n++){
                        if (this.matchDetail[i].runners[o].ex.availableToLay[n].size > 999 && this.matchDetail[i].runners[o].ex.availableToLay[n].size < 1000000) {
                          this.matchDetail[i].runners[o].ex.availableToLay[n].size = (this.matchDetail[i].runners[o].ex.availableToLay[n].size / 1000).toFixed(1) + 'K'; // convert to K for number from > 1000 < 1 million 
                        } else if (this.matchDetail[i].runners[o].ex.availableToLay[n].size > 1000000) {
                          this.matchDetail[i].runners[o].ex.availableToLay[n].size = (this.matchDetail[i].runners[o].ex.availableToLay[n].size / 1000000).toFixed(1) + 'M'; // convert to M for number from > 1 million 
                        } else if (this.matchDetail[i].runners[o].ex.availableToLay[n].size < 900) {
                          this.matchDetail[i].runners[o].ex.availableToLay[n].size = this.matchDetail[i].runners[o].ex.availableToLay[n].size; // if value < 1000, nothing to do
                        }
                      }
                    }
                  }
                }
                } else {
                  // console.log("948",result);
                  
                  this.fancyDta = result.data;
                  // console.log("951",this.fancyDta);
                  for(let i = 0; i< this.fancy.length;i++){
                    if (this.fancy[i].fancy_id == this.fancyDta.fancy_id) {
                      this.fancy[i].session_value_yes = this.fancyDta.BackPrice1;
                      this.fancy[i].session_size_yes = this.fancyDta.BackSize1;
                      this.fancy[i].session_value_no = this.fancyDta.LayPrice1;
                      this.fancy[i].session_size_no = this.fancyDta.LaySize1;
                      this.fancy[i].display_message = this.fancyDta.GameStatus;
                      // console.log("959",this.fancy[i]);
                      break
                  }
                }
                
              this.cdRef.detectChanges();
          }
        }
            })
          }

        } else {
          this.toastr.success(res.msg,'',{
            positionClass: 'toast-bottom-right',
            timeOut:1000
           })
        }
      }
    })
  }
  
  socketFancySuccess(){
    this.socketService.socket.on('success',(res) => {
      if(res.status == true){
        if (res.event_code == "subscribe_event") {
          for (let i = 0; i < this.fancyId.length; i++) {
            this.socketOnEvent(this.fancyId[i], result => {
              if (result.status == true) {
                  this.fancyDta = result.data;
                  for(let i = 0; i< this.fancy.length;i++){
                    if (this.fancy[i].fancy_id == this.fancyDta.fancy_id) {
                      this.fancy[i].session_value_yes = this.fancyDta.BackPrice1;
                      this.fancy[i].session_size_yes = this.fancyDta.BackSize1;
                      this.fancy[i].session_value_no = this.fancyDta.LayPrice1;
                      this.fancy[i].session_size_no = this.fancyDta.LaySize1;
                      this.fancy[i].display_message = this.fancyDta.GameStatus;
                      // console.log("959",this.fancy[i]);
                      break
                  }
                }
                
              this.cdRef.detectChanges();
          // }
        }
            })
          }

        } else {
          this.toastr.success(res.msg,'',{
            positionClass: 'toast-bottom-right',
            timeOut:1000
           })
        }
      }
    })
  }
  getRunnerEmit() {
    for (let i = 0; i < this.matchDetailFirst.length; i++) {
      let data = this.matchDetailFirst[i].market_id
      this.marketId.push(data);
    }
    let event = {
      "eventIds": this.marketId
    }
    this.socketEmitEvent('subscribe_event', event);
  }
  
  socketListeners() {

  //   // this.socketOnEvent(`getFancyList`, data => {
  //   //   if (data.status == true ) {
  //   //     this.fancy = data.data;
  //   //   } else {
  //   //     this.toastr.error(data.msg,'',{
  //   //   timeOut: 10000,
  //   // });
  //   //   }
  //   // });
  //   this.socketOnEvent(`homeMatchesRunners`, res => {
  //     if (res.status) {
  //       // this.runnerData = res.data;

  //     }
  //   });

  this.socketOnEvent(this.match_id + `_new_market_added`, res => {
    if(res.status == true){
      // this.toastr.success(res.msg,'',{
      //   positionClass: 'toast-bottom-right',
      //   timeOut:1000
      //  })
      this.getMatchDetail();
    }
      });

    this.socketOnEvent(this.match_id + `_fancy_added`, res => {
      if (res.status == true) {
        // this.toastr.success(res.msg, '', {
        //   positionClass: 'toast-bottom-right',
        //   timeOut: 1000
        // })
        if(res.hasData == true){
          
          
          this.createFancyType = 1
          if(this.createFancyType == 1){
            let fancyData = res.data;
            for (let i = 0; i < 1; i++) {
              if (this.sessionSettingValues != undefined) {
                for (let j = 0; j < Object.keys(this.sessionSettingValues).length; j++) {
                  if (fancyData.fancy_id == Object.keys(this.sessionSettingValues)[j]) {
                    let key = Object.values(this.sessionSettingValues)[j]
                    fancyData.min_stake = Object.values(this.sessionSettingValues)[j]['session_min_stack']
                    fancyData.max_stake = Object.values(this.sessionSettingValues)[j]['session_max_stack']
                    fancyData.max_profit = Object.values(this.sessionSettingValues)[j]['session_max_profit']
                  }
                }
              }
            }
            let a3 = fancyData;
            this.fancyArray = {
              display_message: 'SUSPENDED',
              fancy_id: a3.fancy_id,
              is_active: a3.is_active,
              is_created: 1,
              is_lock: a3.is_lock,
              max_profit: 0,
              max_stake: 0,
              min_stake: 0,
              name: a3.fancy_name,
              selection_id: a3.selection_id,
              session_size_no: '0',
              session_size_yes: '0',
              session_value_no: '0',
              session_value_yes: '0',
            }
            this.fancy.push(this.fancyArray);
            this.fancyId = [];
            this.fancyId.push(a3.fancy_id);
            let event = {
              "eventIds": this.fancyId
            }
            this.socketEmitEvent('subscribe_event', event);
            this.cdRef.detectChanges();
            this.createFancyType = 2;
          }
        } else {
          this.showFancy();
        }
        
        
      }
    });

    this.socketOnEvent(`socket_state_changed`, res => {
      this.isSocket = res.is_socket;
      this.getMatchDetail();
      this.showFancy();
      if (this.isSocket == 0) {
        this.marketId = []
        for (let i = 0; i < this.matchDetailFirst.length; i++) {
          let data = this.matchDetailFirst[i].market_id
          this.marketId.push(data);
        }
        for (let i = 0; i < this.primaryFancy.length; i++) {
          let data = this.primaryFancy[i].fancy_id
          this.marketId.push(data);
        }
        let event = {
          "eventIds": this.marketId
        }
        this.socketEmitEvent('unsubscribe_event', event);
      } else {
        clearTimeout(this.fancyTimer);
        clearTimeout(this.timer)
      }
    });
  }



  getFancyList() {
    this.matchData = JSON.parse(localStorage.getItem('matchData'));
    let param = {
      match_id: this.matchData.match_id
    };
    this.sport.getFancyList(param).subscribe((res) => {
      if (res.status == true) {
        // this.toastr.success(res.msg,'',{
        //    positionClass: 'toast-bottom-right',
        //    timeOut:1000
        //   });
        this.fancyList = res.data;
        this.fancyList = this.fancyList.filter(t => t.is_active == '0' || t.is_active == '1');
        if (this.fancyList.length != this.fancyResultInputValue.length) {
          this.fancyList.forEach(element => {
            this.fancyResultInputValue.push('')
          });
        }


      } else {
        if(res.logout == true){
          this.head.logoutUser();
        }
      }

    }, (err) => {
      console.log(err)
    }
      // ,
      // () => {
      //   if (this.router.url.split('?')[0] == '/match-detail') {
      //     this.timer = setTimeout(() => resolve(this.getFancyList()), 5000);
      //   }
      // }
    )
  }

  updateStatus(fancyData) {
    if (fancyData.is_created == '0' && fancyData.is_active == 0) {
      this.saveIndianFancy(fancyData);
    } else {
      if (fancyData.is_created == 1 && fancyData.is_active == 0) {
        this.updateFancy(fancyData, 1)
      } else {
        this.updateFancy(fancyData, 0)
      }
    }
  }

  saveIndianFancy = function (fancyData) {
    this.load = true;
    var sportdata = {
      'sport_id': fancyData.sport_id,
      'sport_name': fancyData.sport_name,
      "series_id": fancyData.series_id,
      "series_name": fancyData.series_name,
      'match_id': fancyData.match_id,
      'match_name': fancyData.match_name,
      'name': fancyData.name,
      'fancy_name': fancyData.fancy_name,
      "selection_id": fancyData.selection_id.toString(),
      "session_value_yes": fancyData.BackPrice1.toString(),
      "session_value_no": fancyData.LayPrice1.toString(),
      "session_size_no": fancyData.LaySize1.toString(),
      "session_size_yes": fancyData.BackSize1.toString(),
      "centralId": fancyData.centralId
    };

    this.sport.createFancy(sportdata).subscribe(response => {
      if (response.status == true) {
        this.marketSettingApi(this.matchData.sport_id, this.matchData.match_id)
        this.toastr.success(response.msg, '', {
          positionClass: 'toast-bottom-right',
          timeOut: 1000
        });
        this.createFancyType = 1;
        // this.marketSettingApi(this.matchData.sport_id, this.matchData.match_id)
        this.getFancyList();
      } else {
        if(response.logout == true){
          this.head.logoutUser();
        }
      }

      // this.load = false;
      // this.loading = false;
      // if (!response.error) {
      //   this.getIndianFancy();

      //   this.message = response.message;
      //   this.toastr.successToastr(response.message)
      // } else{
      //   this.toastr.errorToastr(response.message,'',{
      //   timeOut: 10000,
      // })
      // }
    }, error => {
      this.loading = false;
      this.load = false;
    });
  };

  updateFancy(fancy, active) {
    if (active == 0) {
      if (confirm("Are you sure want to Deactive fancy " + "\n" + fancy.name)) {
        let param = {
          "user_id": this.adminDetails.user_id,
          "fancy_id": fancy.fancy_id,
          "is_active": active.toString()
        }
        this.sport.updateFancyStatus(param).subscribe((result) => {
          if (result.status == true) {
            this.toastr.success(result.msg, '', {
              positionClass: 'toast-bottom-right',
              timeOut: 1000
            });
            this.getFancyList();
            this.showFancy();
          } else {
            this.toastr.error(result.msg, '', {
              timeOut: 10000,
            });
            if(result.logout == true){
              this.head.logoutUser();
            }
          }

        }, (err) => {
          console.log(err);
        });
      }
    } else {
      let param = {
        "user_id": this.adminDetails.user_id,
        "fancy_id": fancy.fancy_id,
        "is_active": active.toString()
      }
      this.sport.updateFancyStatus(param).subscribe((result) => {
        if (result.status == true) {
          this.toastr.success(result.msg, '', {
            positionClass: 'toast-bottom-right',
            timeOut: 1000
          });
          this.getFancyList();
        } else {
          this.toastr.error(result.msg, '', {
            timeOut: 10000,
          });
          if(result.logout == true){
            this.head.logoutUser();
          }
        }

      }, (err) => {
        console.log(err);
      });
    }
  }

  showFancy() {
    this.matchData = JSON.parse(localStorage.getItem('matchData'));
    if (this.callingFancyType == 1) {
      let param = {
        "user_id": this.adminDetails.user_id,
        "match_id": this.matchData.match_id,
      }
        this.sport.showFancyList(param).subscribe((res) => {
          if (res.status == true) {
            if (res.data.length == 0) {
              this.callingFancyType = 1;
              this.fancy = [];
              this.showFancyList = false;
              this.cdRef.detectChanges();
            } else {
              this.showFancyList = true;
              this.callingFancyType = 2;
              let fancyData = res.data;

              for (let i = 0; i < fancyData.length; i++) {
                fancyData[i].type = 2;
                if (this.sessionSettingValues != undefined) {
                  for (let j = 0; j < Object.keys(this.sessionSettingValues).length; j++) {
                    if (fancyData[i].fancy_id == Object.keys(this.sessionSettingValues)[j]) {
                      let key = Object.values(this.sessionSettingValues)[j]
                      fancyData[i].min_stake = Object.values(this.sessionSettingValues)[j]['session_min_stack']
                      fancyData[i].max_stake = Object.values(this.sessionSettingValues)[j]['session_max_stack']
                      fancyData[i].max_profit = Object.values(this.sessionSettingValues)[j]['session_max_profit']
                    }
                  }
                }

              }
              this.primaryFancy = fancyData;
              this.fancyDataArray = [];
              for (let i = 0; i < this.primaryFancy.length; i++) {
                this.fancyArray = {
                  news: this.primaryFancy[i].news == '' ? undefined : this.primaryFancy[i].news,
                  type : this.primaryFancy[i].type,
                  display_message: this.primaryFancy[i].GameStatus,
                  fancy_id: this.primaryFancy[i].fancy_id,
                  is_active: this.primaryFancy[i].is_active,
                  is_created: this.primaryFancy[i].is_created,
                  is_lock: this.primaryFancy[i].is_lock,
                  max_profit: this.primaryFancy[i].max_profit,
                  max_stake: this.primaryFancy[i].max_stake,
                  min_stake: this.primaryFancy[i].min_stake,
                  name: this.primaryFancy[i].name,
                  selection_id: this.primaryFancy[i].selection_id,
                  session_size_no: '0' ,
                  session_size_yes: '0',
                  session_value_no: '0',
                  session_value_yes: '0' ,
                }
                this.fancyDataArray.push(this.fancyArray)
              }
              this.fancy = this.fancyDataArray;
              console.log("1318",this.fancy);
              this.getFancyLiability()
              this.showFancy();
              this.fancyRunner();
              // this.marketSettingApi(this.matchData.sport_id, this.matchData.match_id);
              this.cdRef.detectChanges();
            }

          } else {
            if(res.logout == true){
              this.head.logoutUser();
            }
          }
        }, (err) => {
          console.log(err);
        })
     
    } 
    else {
      let param = {
        "user_id": this.adminDetails.user_id,
        "match_id": this.matchData.match_id,
        // "page": 1,
        // "limit": 100
      }
        this.fancyId = [];
        this.sport.showFancyList(param).subscribe((res) => {
          this.showFancyList = true;
          if (res.status == true) {
            if(res.data.length == 0){
              this.fancy = [];
              this.cdRef.detectChanges();
            } else {
            let fancyData = res.data;
            for (let i = 0; i < fancyData.length; i++) {
              fancyData[i].type = 2;
              if (this.sessionSettingValues != undefined) {
                for (let j = 0; j < Object.keys(this.sessionSettingValues).length; j++) {
                  if (fancyData[i].fancy_id == Object.keys(this.sessionSettingValues)[j]) {
                    let key = Object.values(this.sessionSettingValues)[j]
                    fancyData[i].min_stake = Object.values(this.sessionSettingValues)[j]['session_min_stack']
                    fancyData[i].max_stake = Object.values(this.sessionSettingValues)[j]['session_max_stack']
                    fancyData[i].max_profit = Object.values(this.sessionSettingValues)[j]['session_max_profit']
                  }
                }
              }

            }
            this.primaryFancy = fancyData;
            this.fancyDataArray = [];
        for (let i = 0; i < this.primaryFancy.length; i++) {
          this.fancyArray = {
            news: this.primaryFancy[i].news == '' ? undefined : this.primaryFancy[i].news,
            type : this.primaryFancy[i].type,
            display_message: this.primaryFancy[i].GameStatus,
            fancy_id: this.primaryFancy[i].fancy_id,
            is_active: this.primaryFancy[i].is_active,
            is_created: this.primaryFancy[i].is_created,
            is_lock: this.primaryFancy[i].is_lock,
            max_profit: this.primaryFancy[i].max_profit,
            max_stake: this.primaryFancy[i].max_stake,
            min_stake: this.primaryFancy[i].min_stake,
            name: this.primaryFancy[i].name,
            selection_id: this.primaryFancy[i].selection_id,
            session_size_no: '0' ,
            session_size_yes: '0',
            session_value_no: '0',
            session_value_yes: '0' ,
          }
          this.fancyDataArray.push(this.fancyArray)
        }
        this.fancy = this.fancyDataArray;
            // this.marketSettingApi(this.matchData.sport_id, this.matchData.match_id);
            if(this.isSocket != 1){
              this.fancyRunner();
            } else {
              for (let i = 0; i < this.primaryFancy.length; i++) {
                let data = this.primaryFancy[i].fancy_id
                this.fancyId.push(data);
              }
              let event = {
                "eventIds": this.fancyId
              }
              this.socketEmitEvent('subscribe_event', event);
              this.cdRef.detectChanges
            }
          }
          this.getFancyLiability()
            this.cdRef.detectChanges();
          } else {
            if(res.logout == true){
              this.head.logoutUser();
            }
          }
        }, (err) => {
          console.log(err);
        },() => {
          if (this.router.url.split('?')[0] == '/match-detail') {
              if(this.isSocket != 1){
                this.fancyTimer = setTimeout(() => resolve(this.showFancy()), 1000);
              } else {
                clearTimeout(this.fancyTimer);
              }
          }
        })
     
    }


  }
  clearFancy(){
    // let data = {};
    // this.sport.clearFancyList(data).subscribe((res) => {
    //   if(res.status){
    //     this.toastr.success(res.msg)
    //   }
    // })
  }
  fancyRunner() {
    this.matchData = JSON.parse(localStorage.getItem('matchData'));
    let data = {
      "match_id": this.matchData.match_id
    };
    this.sport.showFancyListRunner(data).subscribe((res) => {
      if (res.status == true) {
        this.fancyRunnerData = res.data;
        let a3 = this.primaryFancy.map(t1 => ({ ...t1, ...this.fancyRunnerData.find(t2 => (t2.SelectionId == t1.selection_id)) }));
        this.fancyDataArray = [];
        for (let i = 0; i < a3.length; i++) {
          this.fancyArray = {
            news: a3[i].news == '' ? undefined : a3[i].news,
            type : a3[i].type,
            display_message: a3[i].GameStatus,
            fancy_id: a3[i].fancy_id,
            is_active: a3[i].is_active,
            is_created: a3[i].is_created,
            is_lock: a3[i].is_lock,
            max_profit: a3[i].max_profit,
            max_stake: a3[i].max_stake,
            min_stake: a3[i].min_stake,
            name: a3[i].name,
            selection_id: a3[i].SelectionId,
            session_size_no: a3[i].LaySize1 == undefined ? '0' : a3[i].LaySize1,
            session_size_yes: a3[i].BackSize1 == undefined ? '0' : a3[i].BackSize1,
            session_value_no: a3[i].LayPrice1 == undefined ? '0' : a3[i].LayPrice1,
            session_value_yes: a3[i].BackPrice1 == undefined ? '0' : a3[i].BackPrice1,
          }
          this.fancyDataArray.push(this.fancyArray)
        }
        this.fancy = this.fancyDataArray;
        this.cdRef.detectChanges();
      } else {
        if(res.logout == true){
          this.head.logoutUser();
        } else {
          this.fancyDataArray = [];
          let a3 = this.primaryFancy;
        for (let i = 0; i < a3.length; i++) {
          this.fancyArray = {
            news: a3[i].news == '' ? undefined : a3[i].news,
            type : a3[i].type,
            display_message:  'SUSPENDED' ,
            fancy_id: a3[i].fancy_id,
            is_active: a3[i].is_active,
            is_created: a3[i].is_created,
            is_lock: a3[i].is_lock,
            max_profit: 0,
            max_stake: 0,
            min_stake: 0,
            name: a3[i].fancy_name,
            selection_id: a3[i].selection_id,
            session_size_no: '0',
            session_size_yes: '0',
            session_value_no:  '0' ,
            session_value_yes: '0',
          }
          this.fancyDataArray.push(this.fancyArray)
        }
        this.fancy = this.fancyDataArray;
        this.cdRef.detectChanges();
        }
      }

    },() => {
      if (this.router.url.split('?')[0] == '/match-detail') {
        // this.timer = setTimeout(() => resolve(this.fancyRunner()), 1000);
      }
    })
  }
  ngOnDestroy() {
    this.socketService.socket.close();
  }

  scoreApi() {
    this.matchData = JSON.parse(localStorage.getItem('matchData'));
    this.http.get('https://ex.sawexch.com/api/v2/getLiveScore?id=' + this.matchData.match_id).subscribe((data) => {
      if (data['status'] == '1') {
        if (data["result"]["type"] == "up" || data["result"]["type"] == "auto") {

        } else {
          this.score = true;
          this.scoreData = data["result"]["home"];
          this.scoreLength = Object.keys(this.scoreData).length;
          if ((this.scoreLength) <= 31) {
            this.twenty = true;
            this.scoreBoard = {
              "b1s": (this.scoreData.b1s).split(','),
              "b2s": (this.scoreData.b2s).split(','),
              "bw": this.scoreData.bw,
              "i": this.scoreData.i,
              "i1": {
                "ov": this.scoreData.i1.ov,
                "sc": this.scoreData.i1.sc,
                "wk": this.scoreData.i1.wk
              },
              "i1b": this.scoreData.i1b,
              "i2": {
                "ov": this.scoreData.i2.ov,
                "sc": this.scoreData.i2.sc,
                "tr": this.scoreData.i2.tr,
                "wk": this.scoreData.i2.wk
              },
              "iov": this.scoreData.iov,
              "lw": this.scoreData.lw,
              "p1": this.scoreData.p1,
              "p2": this.scoreData.p2,
              "pb": (this.scoreData.pb).split(','),
              "pt": (this.scoreData.pt).split(','),
              "t1": {
                "f": this.scoreData.t1.f,
                "ic": this.scoreData.t1.ic,
                "n": this.scoreData.t1.n
              },
              "t2": {
                "f": this.scoreData.t2.f,
                "ic": this.scoreData.t2.ic,
                "n": this.scoreData.t2.n
              }
            }
            this.perball = (this.scoreBoard.pb).slice(1).slice(-6);
          } else {
            this.twenty = false;
            this.scoreBoard = {
              "b1s": (this.scoreData.b1s).split(','),
              "b2s": (this.scoreData.b2s).split(','),
              "bw": this.scoreData.bw,
              "i": this.scoreData.i,
              "i1": {
                "ov": this.scoreData.i1.ov,
                "sc": this.scoreData.i1.sc,
                "wk": this.scoreData.i1.wk
              },
              "i1b": this.scoreData.i1b,
              "i3b": this.scoreData.i3b,
              "i2": {
                "ov": this.scoreData.i2.ov,
                "sc": this.scoreData.i2.sc,
                "tr": this.scoreData.i2.tr,
                "wk": this.scoreData.i2.wk
              },
              "i3": {
                "ov": this.scoreData.i3.ov,
                "sc": this.scoreData.i3.sc,
                "tr": this.scoreData.i3.tr,
                "wk": this.scoreData.i3.wk
              },
              "i4": {
                "ov": this.scoreData.i4.ov,
                "sc": this.scoreData.i4.sc,
                "tr": this.scoreData.i4.tr,
                "wk": this.scoreData.i4.wk
              },
              "iov": this.scoreData.iov,
              "lw": this.scoreData.lw,
              "p1": this.scoreData.p1,
              "p2": this.scoreData.p2,
              "pb": (this.scoreData.pb).split(','),
              "pt": (this.scoreData.pt).split(','),
              "t1": {
                "f": this.scoreData.t1.f,
                "ic": this.scoreData.t1.ic,
                "n": this.scoreData.t1.n
              },
              "t2": {
                "f": this.scoreData.t2.f,
                "ic": this.scoreData.t2.ic,
                "n": this.scoreData.t2.n
              }
            }
            this.perball = (this.scoreBoard.pb).slice(1).slice(-6);
          }

        }
      }
    }, (err) => {
    },
      () => {
        if (this.router.url.split('?')[0] == '/match-detail') {
          // this.timer = setTimeout(() => resolve(this.scoreApi()), 3000);
        }
      })
  }
  getMyBets(pagenumber, from?: string) {
    this.matchData = JSON.parse(localStorage.getItem('matchData'));
    let data = {
        "match_id": this.matchData.match_id,
        "limit": 50,
        "page": pagenumber,
        search: {
          bet_result_id: {
            '$eq': null
          },
          "domain_name" : this.allBetDomain == undefined ? '' : this.allBetDomain,
          "market_id": this.market_id == undefined ? '' : this.market_id,
          "_id": this.userId == undefined ? '' : this.userId,
          "user_name": this.allBetUserName == undefined ? '' : this.allBetUserName,
          "selection_name": this.allBetSelection == undefined ? '' : this.allBetSelection,
          "is_back": this.bet == undefined ? '' : this.bet,
          "odds": this.allBetRate == undefined ? '' : this.allBetRate,
          "stack": this.allBetStake == undefined ? '' : this.allBetStake,
        }
      }
      if(data.search.domain_name == ''){
        delete data.search.domain_name
      }
      if(data.search.market_id == ''){
        delete data.search.market_id
      }
      if(data.search._id == ''){
        delete data.search._id
      }
      if(data.search.user_name == ''){
        delete data.search.user_name
      }
      if(data.search.selection_name == ''){
        delete data.search.selection_name
      }
      if(data.search.is_back == ''){
        delete data.search.is_back
      }
      if(data.search.odds == ''){
        delete data.search.odds
      }
      if(data.search.stack == ''){
        delete data.search.stack
      }
    this.sport.getBet(data).subscribe((res) => {
      if (res.status == true) {
          this.betValue = true;
          this.betDataLength = res.data.metadata[0].total;
            this.betData = res.data.data;
            this.totalItems = res.data.metadata[0].total
            this.currentPage = res.data.metadata[0].page
            this.cdRef.detectChanges();
         

      } else {
        this.messageData = "No record Found";
          this.betValue = false;
          this.betDataLength = 0;
          this.matchedBetsLength = 0;
          this.fancyBetsLength = 0;
          this.deletedBetsLength = 0;
        if(res.logout == true){
          this.head.logoutUser();
        }
        this.cdRef.detectChanges();
      }

    }, (err) => {
      console.log(err);

    }, () => {
      if (this.router.url.split('?')[0] == '/match-detail') {
          this.allBetTimer = setTimeout(() => resolve(this.getMyBets(this.currentPage)), 5000);
      }
    })
  }
  onSelectionList(data) {
    this.betTypeFilter = data
  }
  onFancySelectionList(data) {
    this.betFancyTypeFilter = data
  }
  clearBetPopUp() {
    this.userName = '';
    this.selectionName = '';
    this.betTypeFilter = 'All'
    this.oddsRate = '';
    this.stakeAmount = '';
    this.getBetsBySearch(this.market_id, '', 'popup');
  }
  clearFancyBetPopupFilter() {
    this.userName = '';
    this.selectionName = '';
    this.betFancyTypeFilter = 'All'
    this.oddsRate = '';
    this.stakeAmount = '';
    this.getFancyBetsBySearch(this.market_id, 'popup')
  }
  clearAllBet() {
    this.allBetUserName = '';
    this.allBetSelection = '';
    this.betTypeFilter = 'All';
    this.allBetRate = '';
    this.allBetStake = '';
    this.allBetDomain = ''
    this.getMyBets(1);
  }
  clearMatchBet() {
    this.matchBetUserName = '';
    this.matchBetSelection = '';
    this.betTypeFilter = 'All';
    this.matchBetRate = '';
    this.matchBetStake = '';
    this.matchBetDomain = ''
    this.getMyBets(1);
  }
  clearFancyBet() {
    this.fancyBetUserName = '';
    this.fancyBetSelection = '';
    this.betFancyTypeFilter = 'All'
    this.fancyBetRate = '';
    this.fancyBetStake = '';
    this.fancyBetDomain = ''
    this.getMyBets(1);
  }
  getBetsBySearch(matchdata, filterType, from?: string) {
    this.matchData = JSON.parse(localStorage.getItem('matchData'));
    this.market_id = matchdata;
    let data;
    if (this.betTypeFilter == 'All') {
      this.bet = '';
    } else if (this.betTypeFilter == 'Back') {
      this.bet = '1';
    } else if (this.betTypeFilter == 'Lay') {
      this.bet = '0';
    }
    if (from == 'popup') {
      data = {
        "match_id": this.matchData.match_id,
        "limit": 50,
        "page": this.betPoupcurrentPage,
        "search": {
          "market_id": this.market_id == undefined ? '' : this.market_id,
          "_id": this.userId == undefined ? '' : this.userId,
          "user_name": this.userName == undefined ? '' : this.userName,
          "selection_name": this.selectionName == undefined ? '' : this.selectionName,
          "is_back": this.bet == undefined ? '' : this.bet,
          "odds": this.oddsRate == undefined ? '' : this.oddsRate,
          "stack": this.stakeAmount == undefined ? '' : this.stakeAmount,
          "createdAt": this.allBetplacedTime == undefined ? '' : this.allBetplacedTime.toISOString(),
          "bet_result_id": {
            '$eq': null
          }
        }
      }

    } else {
      if (filterType == 1) {
        data = {
          "match_id": this.matchData.match_id,
          "limit": 50,
          "page": 1,
          "search": {
            "domain_name" : this.allBetDomain == undefined ? '' : this.allBetDomain,
            "market_id": this.market_id == undefined ? '' : this.market_id,
            "_id": this.userId == undefined ? '' : this.userId,
            "user_name": this.allBetUserName == undefined ? '' : this.allBetUserName,
            "selection_name": this.allBetSelection == undefined ? '' : this.allBetSelection,
            "is_back": this.bet == undefined ? '' : this.bet,
            "odds": this.allBetRate == undefined ? '' : this.allBetRate,
            "stack": this.allBetStake == undefined ? '' : this.allBetStake,
            "bet_result_id": {
              '$eq': null
            }
            // "delete_status": 0,
            // "bet_result_id":1
          }
        }
        clearTimeout(this.allBetTimer)
      } else if (filterType == 2) {
        data = {
          "match_id": this.matchData.match_id,
          "limit": 50,
          "page": 1,
          "search": {
            "domain_name" : this.matchBetDomain == undefined ? '' : this.matchBetDomain,
            "market_id": this.market_id == undefined ? '' : this.market_id,
            "_id": this.userId == undefined ? '' : this.userId,
            "user_name": this.matchBetUserName == undefined ? '' : this.matchBetUserName,
            "selection_name": this.matchBetSelection == undefined ? '' : this.matchBetSelection,
            "is_back": this.bet == undefined ? '' : this.bet,
            "odds": this.matchBetRate == undefined ? '' : this.matchBetRate,
            "stack": this.matchBetStake == undefined ? '' : this.matchBetStake,
            "bet_result_id": {
              '$eq': null
            }
            // "delete_status": 0,
            // "bet_result_id":1
          }
        }
        clearTimeout(this.matchBetTimer)
      }

    }
    if(data.search.domain_name == ''){
      delete data.search.domain_name
    }
    if (data.search.market_id == '') {
      delete data.search.market_id
    }
    if (data.search._id == '') {
      delete data.search._id
    }
    if (data.search.user_name == '') {
      delete data.search.user_name
    }
    if (data.search.selection_name == '') {
      delete data.search.selection_name
    }
    if (data.search.is_back == '') {
      delete data.search.is_back
    }
    if (data.search.odds == '') {
      delete data.search.odds
    }
    if (data.search.stack == '') {
      delete data.search.stack
    }
    if (data.search.createdAt == '') {
      delete data.search.createdAt
    }
    this.sport.getBet(data).subscribe((res) => {
      if (res.status == true) {
        this.intialPopbetData = res.data.data;
        this.popbetData = res.data.data;
        if (from != 'popup') {
          if (filterType == 1) {
            this.betValue = true;
            this.betData = res.data.data;
            this.betDataLength = res.data.metadata[0].total;
            this.currentPage = res.data.metadata[0].page
            this.totalItems = res.data.metadata[0].total;
            clearTimeout(this.allBetTimer)
          } else if (filterType == 2) {
            this.matchValue = true;
            this.matchedBets = res.data.data;
            this.matchedBetsLength = this.matchedBets.length;
            this.matchtotal_items = res.data.metadata[0].total
            this.matchcurrentPage = res.data.metadata[0].page
            clearTimeout(this.matchBetTimer)
          }
        }
        if (from == 'popup') {
          this.popBetData = true;
          this.betPouptotal_items = res.data.metadata[0].total
        }


      } else {
        this.messageData = "No Record Found ..."
        if (filterType == 1) {
          this.betValue = false;
          clearTimeout(this.allBetTimer)
        } else if (filterType == 2) {
          this.matchValue = false;
          clearTimeout(this.matchBetTimer)
        }
        if (from == 'popup') {
          this.popBetData = false;
        }
        this.betDataLength = 0;
        if(res.logout == true){
          this.head.logoutUser();
        }
      }
    })
  }
  getFancyBetsBySearch(matchdata, from?: string) {
    this.matchData = JSON.parse(localStorage.getItem('matchData'));
    this.market_id = matchdata;
    let data;
    if (this.betFancyTypeFilter == 'All') {
      this.bet = '';
    } else if (this.betFancyTypeFilter == 'Back') {
      this.bet = '1';
    } else if (this.betFancyTypeFilter == 'Lay') {
      this.bet = '0';
    }
    if (from == 'popup') {
      data = {
        "limit": 50,
        "page": 1,
        "search": {
          "fancy_id": this.market_id == undefined ? '' : this.market_id,
          "match_id": this.matchData.match_id,
          "_id": this.userId == undefined ? '' : this.userId,
          "user_name": this.userName == undefined ? '' : this.userName,
          "fancy_name": this.selectionName == undefined ? '' : this.selectionName,
          "is_back": this.bet == undefined ? '' : this.bet,
          "run": this.oddsRate == undefined ? '' : this.oddsRate,
          "stack": this.stakeAmount == undefined ? '' : this.stakeAmount,
          "bet_result_id": {
            '$eq': null
          }
          // "delete_status": 0,
          // "bet_result_id":1
        }
      }
    } else {
      data = {
        "limit": 50,
        "page": 1,
        "search": {
          "domain_name" : this.fancyBetDomain == undefined ? '' : this.fancyBetDomain,
          "fancy_id": this.market_id == undefined ? '' : this.market_id,
          "match_id": this.matchData.match_id,
          "_id": this.userId == undefined ? '' : this.userId,
          "user_name": this.fancyBetUserName == undefined ? '' : this.fancyBetUserName,
          "fancy_name": this.fancyBetSelection == undefined ? '' : this.fancyBetSelection,
          "is_back": this.bet == undefined ? '' : this.bet,
          'is_fancy': 1,
          "run": this.fancyBetRate == undefined ? '' : this.fancyBetRate,
          "stack": this.fancyBetStake == undefined ? '' : this.fancyBetStake,
          "bet_result_id": {
            '$eq': null
          }
          // "delete_status": 0,
          // "bet_result_id":1
        }
      }
      clearTimeout(this.fancyBetTimer)
    }
    if (data.search.fancy_id == '') {
      delete data.search.fancy_id
    }
    if (data.search.domain_name == '') {
      delete data.search.domain_name
    }
    if (data.search._id == '') {
      delete data.search._id
    }
    if (data.search.user_name == '') {
      delete data.search.user_name
    }
    if (data.search.fancy_name == '') {
      delete data.search.fancy_name
    }
    if (data.search.is_back == '') {
      delete data.search.is_back
    }
    if (data.search.run == '') {
      delete data.search.run
    }
    if (data.search.stack == '') {
      delete data.search.stack
    }
    this.sport.getBet(data).subscribe((res) => {
      if (res.status == true) {
        this.intialPopbetData = res.data.data;
        this.popbetData = res.data.data;
        if (from != 'popup') {
          this.fancyValue = true;
          this.fancyBets = res.data.data;
          this.fancyBetsLength = this.fancyBets.length;
          this.fancytotal_items = res.data.metadata[0].total
          this.fancycurrentPage = res.data.metadata[0].page
          // this.betTotalValue = res.data.metadata[0].total;
          clearTimeout(this.fancyBetTimer)
        }
        this.fancyBetData = true;
      } else {
        this.messageData = "No Record Found ...."
        if (from == 'popup') {
          this.fancyBetData = false;
        } else {
          this.fancyValue = false;
        }
        if(res.logout == true){
          this.head.logoutUser();
        }
      }

      // this.matchedBets = this.betData.filter(t => t.is_fancy == '0');
      // this.fancyBets = this.betData.filter(t => t.is_fancy == '1');
    })
  }
  getRunners(matchdata) {
    this.matchRunnerData = matchdata.runners;
  }
  clearPopUp() {
    this.userId = '';
    this.market_id = '';
    this.userName = '';
    this.selectionName = '';
    this.betType = '';
    this.oddsRate = '';
    this.stakeAmount = ''
  }
  homematches() {
    this.userData = {};
    this.sport.getHomeMatchesList(this.userData).subscribe(res => {
      if (res.status) {
        this.firstData = res.data;
        // this.cdRef.detectChanges();
        let matches = this.firstData.reduce((groupSport, sports) => {
          const { sport_name } = sports;
          groupSport[sport_name] = [...groupSport[sport_name] || [], sports];
          return groupSport;
        }, {});
        this.homeData = matches;
      } else {
        this.toastr.error(res.msg, '', {
          timeOut: 10000,
        });
        if(res.logout == true){
          this.head.logoutUser();
        }
      }
    }, (err) => {
      console.log(err);
    })
  }


  myTeamPosition() {
    this.matchData = JSON.parse(localStorage.getItem('matchData'));
    let param = {
      "match_ids": this.matchData.match_id
    };
    this.sport.teamPosition(param).subscribe((res) => {
      if (res.status == true) {
        this.teamPositionData = res.data;
      } else {
        this.toastr.error(res.msg, '', {
          timeOut: 10000,
        })
        if(res.logout == true){
          this.head.logoutUser();
        }
      }


    }, (err) => {
      console.log(err);
    },
    () => {
      if (this.router.url.split('?')[0] == '/match-detail') {
        // this.timer = setTimeout(() => resolve(this.myTeamPosition()), 10000);
      }
    })
  }

  addOtherMarket(data) {
    localStorage.setItem('matchData', JSON.stringify(data));
    if (this.router.url.split('?')[0] == '/match-detail') {
      window.location.reload();
    } else {
      this.router.navigate(['match-detail']);
    }
  }

  copyContent(text) {
    this.objectId = text;
    this.clipboardService.copyFromContent(text)
  }
  contentCopied(e) {
    this.displayTooltip = true;
    this.contenCopied = e.isSuccess;
    setTimeout(() => {
      this.closetooltipDiv()
    }, 1000);
  }
  closetooltipDiv() {
    this.displayTooltip = false;
  }

  // onBetTypeSelectionList(data, from?: string) {
  //   if (data == 'back' || data == "Back" || data == "BACK") {
  //     // this.betType = 'back';
  //     this.bet = '1'
  //   } else if (data == 'lay' || data == "Lay" || data == "LAY") {
  //     // this.betType = 'lay'
  //     this.bet = '0'
  //   } else {
  //     // this.betType = ''
  //     this.bet = ''
  //   }
  //   if (from == 'popup') {
  //     this.filterBetListPopup()
  //   } else {
  //     this.filterAllBetList(from)
  //   }

  //   // this.selectionList = data;
  //   // localStorage.setItem('list',this.selectionList);
  //   // this.userdetail = JSON.parse(localStorage.getItem('userDetails'));
  //   // this.getOwnChild(1,(this.userdetail.data.user_id));
  // }

  // filterBetListPopup() {
  //   let filter = {
  //     'user_name': this.userName == "" ? undefined : this.userName,
  //     'selection_name': this.selectionName == null ? undefined : this.selectionName,
  //     'odds': this.oddsRate == '' ? undefined : this.oddsRate,
  //     'stack': this.stakeAmount == '' ? undefined : this.stakeAmount,
  //     "is_back": this.bet == '' ? undefined : this.bet
  //   }
  //   Object.keys(filter).forEach(key => {
  //     if (filter[key] === undefined) {
  //       delete filter[key];
  //     }
  //   });
  //   let unfilteredData = this.intialPopbetData
  //   this.popbetData = this.intialPopbetData.filter(function (item) {
  //     for (var key in filter) {
  //       let filterData = filter[key].toUpperCase()
  //       let originalData = typeof (item[key]) == "number" ? item[key].toString() : item[key].toUpperCase()
  //       if (item[key] === undefined || !originalData.includes(filterData))
  //         return false;
  //     }
  //     return true;
  //   });

  // }

  // filterAllBetList(from?: string) {
  //   let filter = {
  //     'user_name': this.allBetUserName == "" ? undefined : this.allBetUserName,
  //     'selection_name': this.allBetSelection == "" ? undefined : this.allBetSelection,
  //     'odds': this.allBetRate == "" ? undefined : this.allBetRate,
  //     'stack': this.allBetStake == "" ? undefined : this.allBetStake,
  //     "is_back": this.bet == '' ? undefined : this.bet
  //   }
  //   Object.keys(filter).forEach(key => {
  //     if (filter[key] === undefined) {
  //       delete filter[key];
  //     }
  //   });
  //   this.betData = this.initialBetData.filter(function (item) {
  //     for (var key in filter) {
  //       let filterData = filter[key].toUpperCase()
  //       let originalData = typeof (item[key]) == "number" ? item[key].toString() : item[key].toUpperCase()
  //       if (item[key] === undefined || !originalData.includes(filterData))
  //         return false;
  //     }
  //     return true;
  //   });
  //   if(Object.keys(filter).length == 0){

  //     this.totalItems=this.betDataLength
  //   }else{
  //     this.currentPage=1
  //     this.totalItems=this.betData.length
  //   }

  //   if (from == 'fancy') {
  //     this.fancyBets = this.betData.filter(t => t.is_fancy == '1');
  //   } else if (from == 'match') {
  //     this.matchedBets = this.betData.filter(t => t.is_fancy == '0');
  //   }
  // }

  back() {
    window.history.back()
  }

  fancyPositionData(fancyData, book: TemplateRef<any>) {
    this.selectedFancyMarket = fancyData
    this.modalRef = this.modalService.show(
      book,
      Object.assign({}, { class: '' })
    );
    let data = {
      fancy_id: fancyData.fancy_id
    };
    this.sport.getFancyPosition(data).subscribe((res) => {
      if (res.status == true) {
        this.fancyPosData = res.data.fancy_position;
      } else {
        this.toastr.error(res.msg, '', {
          timeOut: 10000,
        })
        if(res.logout == true){
          this.head.logoutUser();
        }
      }

    })
  }

  fancyResultDeclare(fancy, fancyResultValue) {
    let matchData = JSON.parse(localStorage.getItem('matchData'))
    if (confirm("Are you sure want to declare Fancy Result " + "\n" + matchData.match_name + " --> " + fancy.name + " & result is " + fancyResultValue)) {
      let data = {
        "sport_id": matchData.sport_id,
        "sport_name": matchData.sport_name,
        "series_id": matchData.series_id,
        "series_name": matchData.series_name,
        "match_id": matchData.match_id,
        "match_name": matchData.match_name,
        "fancy_id": fancy.fancy_id,
        "fancy_name": fancy.name,
        "result": fancyResultValue
      }
      this.sport.fancyResult(data).subscribe((res) => {
        if (res.status == true) {
          this.toastr.success(res.msg, '', {
            positionClass: 'toast-bottom-right',
            timeOut: 1000
          });
          this.fancyResultInputValue = []
          this.getFancyList();
        } else {
          this.toastr.error(res.msg);
          if(res.logout == true){
            this.head.logoutUser();
          }
        }
      })
    }
  }

  fancyAbondoned(fancy) {
    let matchData = JSON.parse(localStorage.getItem('matchData'))
    if (confirm("Are you sure want to Abond Fancy " + "\n" + matchData.match_name + " --> " + fancy.name)) {
      let data = {
        "fancy_id": fancy.fancy_id
      }
      this.sport.fancyResultAbonded(data).subscribe((res) => {
        if (res.status == true) {
          this.toastr.success(res.msg, '', {
            positionClass: 'toast-bottom-right',
            timeOut: 1000
          });
          this.getFancyList();
        } else {
          this.toastr.error(res.msg);
          if(res.logout == true){
            this.head.logoutUser();
          }
        }
      })
    }
  }

  getFancyLiability() {
    let data = {
      "match_id": this.match_id
    };
    this.sport.getFancyLiability(data).subscribe(res => {
      if (res.status == true) {
        this.fancyLiability = res.data
      } else {
        if(res.logout == true){
          this.head.logoutUser();
        }
      }
    }, error => {

    })
  }

  pageChange(newPage: number) {
    this.getMyBets(newPage, 'onPageClick')
  }
  matchedBetpageChange(newPage: number) {
    this.matchcurrentPage = newPage
    this.getMyBets(this.matchcurrentPage)
  }
  fancypageChange(newPage: number) {
    this.fancycurrentPage = newPage;
    this.getMyBets(this.fancycurrentPage)
  }
  deleteBetpageChange(newPage: number) {
    this.deleteBetcurrentPage = newPage;
    this.getMyBets(this.deleteBetcurrentPage)
  }
  currentPositionpageChange(newPage: number) {
    this.currentPositioncurrentPage = newPage
  }
  betPouppageChange(marketId, newPage: number) {
    this.betPoupcurrentPage = newPage
    this.getBetsBySearch(marketId, '', 'popup')
  }
  updateLimit(id, type, lock) {
    if (lock == false) {
      if (confirm("Are you sure want to Lock ")) {
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
        this.sport.updateMarketSetting(data).subscribe((res) => {
          if (res.status == true) {
            this.toastr.success(res.msg, '', {
              positionClass: 'toast-bottom-right',
              timeOut: 3000
            });
            if (type == 1) {
              this.router.navigate(['dashboard'])
            } else if (type == 2) {
              this.getMatchDetail();
            } else if (type == 3) {
              this.showFancy();
            }
          } else {
            this.toastr.error(res.msg, '', {
              timeOut: 10000,
            });
            if(res.logout == true){
              this.head.logoutUser();
            }
          }

        })

      }
    } else {
      if (confirm("Are you sure want to UnLock ")) {
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
        this.sport.updateMarketSetting(data).subscribe((res) => {
          if (res.status == true) {
            this.toastr.success(res.msg, '', {
              positionClass: 'toast-bottom-right',
              timeOut: 3000
            });
            if (type == 1) {
              this.router.navigate(['dashboard'])
            } else if (type == 2) {
              this.getMatchDetail();
            } else if (type == 3) {
              this.showFancy();
            }
          } else {
            this.toastr.error(res.msg, '', {
              timeOut: 10000,
            });
            if(res.logout == true){
              this.head.logoutUser();
            }
          }

        })

      }
    }
 
  }
  openModalSportSetting(sportSetting: TemplateRef<any>, user, id, type) {
    this.showSelectedUserName = user.user_name;
    this.selectedUserId = user._id;
    this.Id = id;
    this.typeId = type
    // this.getUserSportsWiseSettingDetails(user._id,user.userSettingSportsWise,user)
    this.modalRef = this.modalService.show(
      sportSetting,
      Object.assign({}, { class: 'sportSetting-modal modal-lg' })
    );
  }
  getMarketLimits(id, type) {
    if (type == 2) {
      this.popUpHead = id.match_name;
    } else if (type == 3) {
      this.popUpHead = id.market_name;
    } else if (type == 4) {
      this.popUpHead = id.name;
    }

    this.specificUserDetails = [];
    this.sessionSetting = false;
    this.marketSetting = false;
    let data;
    if (type == 2) {
      data = {
        match_id: id.match_id
      }
      this.sessionSetting = true;
      this.marketSetting = true;
    } else if (type == 3) {
      data = {
        market_id: id.market_id
      }
      this.sessionSetting = false;
      this.marketSetting = true;
    } else if (type == 4) {
      data = {
        fancy_id: id.fancy_id
      }
      this.marketSetting = false;
      this.sessionSetting = true;
    }
    this.sport.getMarketSetting(data).subscribe((res) => {
      if (res.status == true) {
        let data = res.data.limites
        this.sportsSettingValues = res.data.validations
        if (data.sport_id == '4') {
          if (type == 2 || type == 4) {
            this.sessionSetting = true;
          } else {
            this.sessionSetting = false;
          }

        } else {
          this.sessionSetting = false;
        }
        this.specificUserDetails.push(data)
        this.createSportsSettingArray()
      } else {
        if(res.logout == true){
          this.head.logoutUser();
        }
      }
    })
  }
  get sportsSettingsFormArr(): FormArray {
    return this.sportsForm.get('sports_settings') as FormArray;
  }
  createSportsSettingArray() {
    this.sportsForm.get('sports_settings')['controls'] = []

    this.specificUserDetails.forEach((sport, index) => {
      if (this.typeId == 2) {
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
      } else if (this.typeId == 3) {
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
      } else if (this.typeId == 4) {
        this.sportsSettingsFormArr.push(
          this.fb.group({
            fancy_id: sport.fancy_id,
            session_min_stack: [sport.session_min_stack, Validators.required],
            session_max_stack: [sport.session_max_stack, Validators.required],
            session_max_profit: [sport.session_max_profit, Validators.required]
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
        ValidatorControls.minValueValidator(this.sportsSettingValues.market_min_stack, true, "Market Min Stack value should not be less than " + this.sportsSettingValues.market_min_stack, false),
        ValidatorControls.maxValueValidator(this.sportsSettingsFormArr.controls[index]['controls'].market_max_stack.value, true, "Market Min Stack value should not be greater than Market Max Stack")
      ])

      this.sportsSettingsFormArr.controls[index]['controls'].market_max_stack.setValidators([ValidatorControls.requiredValidator("Market Max Stack is required"),
      ValidatorControls.minValueValidator(this.sportsSettingsFormArr.controls[index]['controls'].market_min_stack.value, true, "Market Max Stack value should not be less than Market Min Stack", false),
      ValidatorControls.maxValueValidator(this.sportsSettingValues.market_max_stack_max_limit, true, "Market Max Stack value should not be greater than " + this.sportsSettingValues.market_max_stack_max_limit)
      ])

      this.sportsSettingsFormArr.controls[index]['controls'].market_min_odds_rate.setValidators([ValidatorControls.requiredValidator("Market Min odds rate is required"),
      ValidatorControls.minValueValidator(this.sportsSettingValues.market_min_odds_rate, true, "Market Min odds rate value should not be less than " + this.sportsSettingValues.market_min_odds_rate, false)
      ])

      this.sportsSettingsFormArr.controls[index]['controls'].market_max_odds_rate.setValidators([ValidatorControls.requiredValidator("Market Max odds rate is required"),
      ValidatorControls.minValueValidator(this.sportsSettingsFormArr.controls[index]['controls'].market_min_odds_rate.value, true, "Market Max odds rate value should not be less than Market Min odds rate", false),
      ValidatorControls.maxValueValidator(this.sportsSettingValues.market_max_odds_rate, true, "Market Max odds rate value should not be greater than " + this.sportsSettingValues.market_max_odds_rate)
      ])

      this.sportsSettingsFormArr.controls[index]['controls'].market_max_profit.setValidators([ValidatorControls.requiredValidator("Market Max profit is required"),
      ValidatorControls.minValueValidator(1, true, "Market Max profit value should not be less than or equal to 0 ", false),
      ValidatorControls.maxValueValidator(this.sportsSettingValues.market_max_profit_max_limit, true, "Market Max profit value should not be greater than " + this.sportsSettingValues.market_max_profit_max_limit)
      ])

      this.sportsSettingsFormArr.controls[index]['controls'].market_advance_bet_stake.setValidators([ValidatorControls.requiredValidator("Before Inplay Match Stake is required"),
      ValidatorControls.minValueValidator(this.sportsSettingValues.market_advance_bet_stake_min_limit, true, "Before Inplay Match Stake value should not be less than or equal to " + this.sportsSettingValues.market_advance_bet_stake_min_limit, false),
      ValidatorControls.maxValueValidator(this.sportsSettingValues.market_advance_bet_stake_max_limit, true, "Before Inplay Match Stake value should not be greater than " + this.sportsSettingValues.market_advance_bet_stake_max_limit)
      ])

      //  this.sportsSettingsFormArr.controls[index]['controls'].market_bet_delay.setValidators([ValidatorControls.requiredValidator("Match Bets Delay is required"), 
      //  ValidatorControls.minValueValidator(this.sportsSettingValues.market_bet_delay, true, "Match Bets Delay value should not be less than parent value", false),
      //  ValidatorControls.maxValueValidator(10, true, "Match Bets Delay value should not be more than 10")
      // ])
      if (this.typeId != 3) {
        this.sportsSettingsFormArr.controls[index]['controls'].session_min_stack.setValidators([ValidatorControls.requiredValidator("Min. Stake Amount  is required"),
        ValidatorControls.minValueValidator(this.sportsSettingValues.session_min_stack, true, "Min. Stake Amount value should not be less than parent value", false)
        ])

        this.sportsSettingsFormArr.controls[index]['controls'].session_max_stack.setValidators([ValidatorControls.requiredValidator("Max. Stake Amount is required"),
        ValidatorControls.minValueValidator(this.sportsSettingsFormArr.controls[index]['controls'].session_min_stack.value, true, "Max. Stake Amount value should not be less than min Stake Amount value", false),
        ValidatorControls.maxValueValidator(this.sportsSettingValues.session_max_stack_max_limit, true, "Max. Stake Amount value should not be greater than " + this.sportsSettingValues.session_max_stack_max_limit)
        ])

        this.sportsSettingsFormArr.controls[index]['controls'].session_max_profit.setValidators([ValidatorControls.requiredValidator("Session Max Profit is required"),
        ValidatorControls.minValueValidator(1, true, "Session Max Profit value should not be less than or equal to 0 ", false),
        ValidatorControls.maxValueValidator(this.sportsSettingValues.session_max_profit_max_limit, true, "Session Max Profit value should not be greater than " + this.sportsSettingValues.session_max_profit_max_limit)
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
      let filteredSports_settings = []
      filteredSports_settings.push(compareResult.differentValueObject);
      let data;
      data = {
        sport_id: this.typeId == 0 ? this.Id : '',
        series_id: this.typeId == 1 ? this.Id : '',
        match_id: this.typeId == 2 ? this.Id : '',
        market_id: this.typeId == 3 ? this.Id : '',
        fancy_id: this.typeId == 4 ? this.Id : '',
        values: filteredSports_settings[0]
      }
      if (data.sport_id == '') {
        delete data.sport_id
      }
      if (data.series_id == '') {
        delete data.series_id
      }
      if (data.match_id == '') {
        delete data.match_id
      }
      if (data.market_id == '') {
        delete data.market_id
      }
      if (data.fancy_id == '') {
        delete data.fancy_id
      }
      if (this.sportsForm.invalid) {
        return
      }


      // if (this.isSocket != 1) {
        this.sport.updateMarketSetting(data).subscribe(result => {
          if (result.status == true) {
            this.marketSettingApi(this.matchData.sport_id, this.matchData.match_id)
            this.toastr.success(result.msg, '', {
              positionClass: 'toast-bottom-right',
              timeOut: 1000
            });
            if (this.typeId == 2) {
              this.getMatchDetail();
              this.showFancy();
            } else if (this.typeId == 3) {
              this.getMatchDetail();
            } else if (this.typeId == 4) {
              this.showFancy();
            }
            this.modalService.hide()
          } else {
            this.toastr.error(result.msg, '', {
              timeOut: 10000,
            });
            if(result.logout == true){
              this.head.logoutUser();
            }
          }
        })
      // }
      // else {
      //   // this.socketEmitEvent('update-sport-wise-setting-details', data);
      // }
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

  applyValidatorsForMaxStack(index) {
    this.sportsSettingsFormArr.controls[index]['controls'].market_max_stack.setValidators([ValidatorControls.requiredValidator("Market Max Stack is required"),
    ValidatorControls.minValueValidator(this.sportsSettingsFormArr.controls[index]['controls'].market_min_stack.value, true, "Market Max Stack value should not be less than Market Min Stack", false),
    ValidatorControls.maxValueValidator(this.sportsSettingValues.market_max_stack_max_limit, true, "Max. Stake Amount value should not be greater than " + this.sportsSettingValues.market_max_stack_max_limit)])
    this.sportsSettingsFormArr.controls[index]['controls'].market_max_stack.updateValueAndValidity();

  }

  applyValidatorsForMaxOddsRate(index) {
    this.sportsSettingsFormArr.controls[index]['controls'].market_max_odds_rate.setValidators([ValidatorControls.requiredValidator("Market Max odds rate is required"),
    ValidatorControls.minValueValidator(this.sportsSettingsFormArr.controls[index]['controls'].market_min_odds_rate.value, true, "Market Max odds rate value should not be less than Market Min odds rate", false),
    ValidatorControls.maxValueValidator(this.sportsSettingValues.market_max_odds_rate, true, "Market Max odds rate value should not be greater than " + this.sportsSettingValues.market_max_odds_rate)
    ])
    this.sportsSettingsFormArr.controls[index]['controls'].market_max_odds_rate.updateValueAndValidity();

  }

  applyValidatorsForMaxstake(index) {
    this.sportsSettingsFormArr.controls[index]['controls'].session_max_stack.setValidators([ValidatorControls.requiredValidator("Max. Stake Amount is required"),
    ValidatorControls.minValueValidator(this.sportsSettingsFormArr.controls[index]['controls'].session_min_stack.value, true, "Max. Stake Amount value should not be less than min Stake Amount value", false),
    ValidatorControls.maxValueValidator(this.sportsSettingValues.session_max_stack_max_limit, true, "Max. Stake Amount value should not be greater than " + this.sportsSettingValues.session_max_stack_max_limit)
    ])
    this.sportsSettingsFormArr.controls[index]['controls'].session_max_stack.updateValueAndValidity();
  }
  applyValidationToFormGroup(formGroupName, jsonArrayName) {
    this.appValidationService.applyValidationRulesToFromGroup(formGroupName, jsonArrayName).then((validators) => {
    }).catch(() => { })
  }
  updateMarketStatus(marketId, status) {
    if (status == 1) {
      if (confirm('Are you sure want to Deactivate Market')) {
        let data = {
          "market_id": marketId,
          "is_active": status == 1 ? 0 : 1
        }
        this.sport.updateMarketStatus(data).subscribe((res) => {
          if (res.status == true) {
            this.toastr.success(res.msg, '', {
              positionClass: 'toast-bottom-right',
              timeOut: 1000
            });
            window.location.reload();
          } else {
            this.toastr.error(res.msg, '', {
              timeOut: 10000,
            });
            if(res.logout == true){
              this.head.logoutUser();
            }
          }
        })
      }
    } else {
      if (confirm('Are you sure want to Activate Market')) {
        let data = {
          "market_id": marketId,
          "is_active": status == 1 ? 0 : 1
        }
        this.sport.updateMarketStatus(data).subscribe((res) => {
          if (res.status == true) {
            this.toastr.success(res.msg, '', {
              positionClass: 'toast-bottom-right',
              timeOut: 1000
            });
            window.location.reload();
          } else {
            this.toastr.error(res.msg, '', {
              timeOut: 10000,
            });
            if(res.logout == true){
              this.head.logoutUser();
            }
          }
        })
      }
    }
  }
  updateMatchStatus(matchId, status) {
    if (status == 1) {
      if (confirm('Are you sure want to Deactivate Match')) {
        let data = {
          "match_id": matchId,
          "is_active": status == 1 ? 0 : 1
        }
        this.sport.updateMatchStatus(data).subscribe((result) => {
          if (result.status == true) {
            this.toastr.success(result.msg, '', {
              positionClass: 'toast-bottom-right',
              timeOut: 1000
            });
            this.router.navigate(['dashboard'])
          } else {
            this.toastr.error(result.msg, '', {
              timeOut: 10000,
            });
            if(result.logout == true){
              this.head.logoutUser();
            }
          }
        })
      }
    } else {
      if (confirm('Are you sure want to Activate Match')) {
        let data = {
          "match_id": matchId,
          "is_active": status == 1 ? 0 : 1
        }
        this.sport.updateMatchStatus(data).subscribe((result) => {
          if (result.status == true) {
            this.toastr.success(result.msg, '', {
              positionClass: 'toast-bottom-right',
              timeOut: 1000
            });
            this.router.navigate(['dashboard'])
          } else {
            this.toastr.error(result.msg, '', {
              timeOut: 10000,
            });
            if(result.logout == true){
              this.head.logoutUser();
            }
          }
        })
      }
    }


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
        if(res.logout == true){
          this.head.logoutUser();
        }
      }
    })
  }
  openModalMarketList(type,marketList: TemplateRef<any>) {
    this.bookType = type;
    this.modalRef = this.modalService.show(
      marketList,
      Object.assign({}, { class: '' })
    );
    this.matchData = JSON.parse(localStorage.getItem('matchData'));
    let data = {
      "match_id": this.matchData.match_id
    }
    this.sport.matchDetails(data).subscribe((res) => {
      if (res.status == true) {
        this.marketPopupData = res.data;
      } else {
        this.toastr.error(res.msg, '', {
          timeOut: 10000,
        })
        if(res.logout == true){
          this.head.logoutUser();
        }
      }
    })
  }
  abonded(match) {
    if (confirm("Are you sure want to Abond " + match.market_name)) {
      let data = {
        "market_id": match.market_id,
      }
      this.sport.matchAbonded(data).subscribe((res) => {
        if (res.status == true) {
          this.toastr.success(res.msg, '', {
            positionClass: 'toast-bottom-right',
            timeOut: 1000
          })
          this.getMatchDetail();
        } else {
          this.toastr.error(res.msg, '', {
            timeOut: 10000,
          })
          if(res.logout == true){
            this.head.logoutUser();
          }
        }
      })
    }
  }

  openModalCondition(Terms: TemplateRef<any>) {
    this.modalRef = this.modalService.show(
      Terms,
      Object.assign({}, { class: 'gray ' })
    );
  }

  openModalTermCondition(TermsCondition: TemplateRef<any>) {
    this.modalRef = this.modalService.show(
      TermsCondition,
      Object.assign({}, { class: 'gray ' })
    );
  }

  onClickEnableFancy(matchData) {
    if (matchData.enable_fancy == 1) {
      if (confirm('Are you sure want to Disable Fancy ?')) {
        let data = {
          'match_id': matchData.match_id,
          'enable_fancy': matchData.enable_fancy == 1 ? 0 : 1
        };
        this.sport.enableFancy(data).subscribe((res) => {
          if (res.status == true) {
            this.toastr.success(res.msg, '', {
              positionClass: 'toast-bottom-right',
              timeOut: 1000
            });
            this.router.navigate(['dashboard'])
            //this.getOnlineMatchDetails(matchData.sport_id,seriesData,sportindex,seriesindex)
          } else {
            this.toastr.error(res.msg)
            if(res.logout == true){
              this.head.logoutUser();
            }
          }
        })
      }
    } else {
      if (confirm('Are you sure want to Enable Fancy ?')) {
        let data = {
          'match_id': matchData.match_id,
          'enable_fancy': matchData.enable_fancy == 1 ? 0 : 1
        };
        this.sport.enableFancy(data).subscribe((res) => {
          if (res.status == true) {
            this.toastr.success(res.msg, '', {
              positionClass: 'toast-bottom-right',
              timeOut: 1000
            });
            this.router.navigate(['dashboard'])
            //this.getOnlineMatchDetails(matchData.sport_id,seriesData,sportindex,seriesindex)
          } else {
            this.toastr.error(res.msg)
            if(res.logout == true){
              this.head.logoutUser();
            }
          }
        })
      }
    }

  }

  updateInplayStatus(id, status) {
    let data;
    if (status == false) {
      if (confirm('Are you sure want to enable Mannual Inplay ?')) {
        data = {
          "match_id": id,
          "values": {
            "inplay": status == false ? true : false
          }
        }
        this.sport.updateMarketSetting(data).subscribe((res) => {
          if (res.status == true) {

            this.toastr.success(res.msg, '', {
              positionClass: 'toast-bottom-right',
              timeOut: 3000
            });
            this.router.navigate(['dashboard'])
          } else {
            this.toastr.error(res.msg, '', {
              timeOut: 10000,
            });
            if(res.logout == true){
              this.head.logoutUser();
            }
          }

        })
      }
    } else {
      if (confirm('Are you sure want to disable Mannual Inplay ?')) {
        data = {
          "match_id": id,
          "values": {
            "inplay": status == false ? true : false
          }
        }
        this.sport.updateMarketSetting(data).subscribe((res) => {
          if (res.status == true) {

            this.toastr.success(res.msg, '', {
              positionClass: 'toast-bottom-right',
              timeOut: 3000
            });
            this.router.navigate(['dashboard'])
          } else {
            this.toastr.error(res.msg, '', {
              timeOut: 10000,
            });
            if(res.logout == true){
              this.head.logoutUser();
            }
          }

        })
      }
    }

  }
  tvOpen(data){
    console.log("3073",data);
    
    if(data == false){
      this.tv = true;
      this.cdRef.detectChanges();
    }else{
      this.tv = false;
      this.cdRef.detectChanges();
    }
    
  }
}