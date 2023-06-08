import { Component, OnInit, ElementRef, ViewChild, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { HeaderComponent } from '../header/header.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { HttpClient, HttpHeaders, HttpHeaderResponse, HttpParams } from '@angular/common/http';
import { resolve } from 'q';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { SportService } from '../services/sport.service';
import { SocketServiceService } from '../services/socket-service.service';
import { CookieService } from 'ngx-cookie-service';
import * as exchange from '../../data.json';
const _ = require("lodash");
@Component({
  selector: 'app-inplay',
  templateUrl: './inplay.component.html',
  styleUrls: ['./inplay.component.scss'],
  providers: [HeaderComponent, SidebarComponent]
})
export class InplayComponent implements OnInit, OnDestroy {
  @ViewChild('widgetsContent', { read: ElementRef }) public widgetsContent: ElementRef<any>;
  moment: any = moment;
  private socket: any;
  timer: any;
  homeData: any;
  allSportsList: any;
  allmatchDetails: any;
  userData: any;
  firstData: any;
  a: any = [];
  runnerData: any;
  parameter: any;
  isSocket;
  updateRunnerData: any = [];
  exchangeGameList: any;
  constructor(private cdRef: ChangeDetectorRef, private cookie: CookieService, private socketService: SocketServiceService, private route: ActivatedRoute, private router: Router, private http: HttpClient, private sport: SportService, private toastr: ToastrService) {

    // this.socketService.setUpSocketConnection();
    this.userData = {};
    this.getHomeMatchCallEvent(this.userData)
    this.isSocket = 0;
    // this.isSocket = this.cookie.get('is_socket');
    if (this.isSocket == 1) {
      // this.socketListenersUser();
    } else {
      // this.homematches();
      this.route.params.subscribe(params => {
        if (params.sportName == undefined) {
          this.userData = {};
          this.parameter = 'inplay'
          this.homematches();

        } else {
          this.parameter = 'inplay'
          this.homematches();
          //  this.getHomeMatchCallEvent(this.parameter)
        }

      })
    }

  }

  async ngOnInit() {
    // this.allSportsList = JSON.parse(localStorage.getItem('sportList'))
    // await this.socketService.setUpSocketConnection();

    // this.homematches();
    this.exchangeGame();
    this.getAllSportsListData();
  }

  exchangeGame(){
    let data = {
      sport_id : "-100"
    };
    this.sport.getHomeMatchesList(data).subscribe((res) => {
      if(res.status == true){
        this.exchangeGameList = res.data
      }
    })
  }
  // socketOnEvent(eventName, callback) {
  //   this.socketService.socket.on(eventName, data => callback(data));
  // }

  // socketEmitEvent(eventName, data) {
  //   this.socketService.socket.emit(eventName, data);
  // }

  homematches() {
    this.sport.getHomeMatchesList(this.userData).subscribe(res => {
      // this.socketService.socket.connected
      if (res.status) {
        this.firstData = res.data;
        this.firstData.forEach(matDta => {
          matDta.manualInplay = matDta.inplay;
        });
        // this.cdRef.detectChanges();
        this.runners();
      } else {
        this.toastr.error(res.msg, '', {
          timeOut: 10000,
        });
      }
    }, (err) => {
      console.log(err);
    }, () => {
      if (this.router.url.split('?')[0] == '/dashboard' || this.router.url.split('?')[0] == '/dashboard/' + this.parameter) {
        this.timer = setTimeout(() => resolve(this.homematches()), 60000);
      }
    })
  }

  runners() {
    this.userData = {};
    this.sport.runnerList(this.userData).subscribe((res) => {
      if (res.status) {
        this.runnerData = res.data;
        for (let i = 0; i < this.firstData.length; i++) {
          for (let j = 0; j < this.runnerData.length; j++) {
            if (this.firstData[i].marketId == this.runnerData[j].marketId) {
              this.updateRunnerData[i] = []
              this.updateRunnerData[i] = (this.runnerData[j]);
              break
            } else {
              this.updateRunnerData[i] = {
                "marketId": this.firstData[i].marketId,
                "status": "SUSPENDED",
                "inplay": false,
                "runners": [
                  {
                    "ex": {
                      "availableToBack": [
                        {
                          "price": "--",
                          "size": "--"
                        }
                      ],
                      "availableToLay": [
                        {
                          "price": "--",
                          "size": "--"
                        }
                      ],
                      "tradedVolume": []
                    }
                  },
                  {
                    "ex": {
                      "availableToBack": [
                        {
                          "price": "--",
                          "size": "--"
                        }
                      ],
                      "availableToLay": [
                        {
                          "price": "--",
                          "size": "--"
                        }
                      ],
                      "tradedVolume": []
                    }
                  }
                ]
              }
            }
          }
        }
        const a3 = this.firstData.map(t1 => ({ ...t1, ...this.updateRunnerData.find(t2 => t2.marketId === t1.marketId) }))
        // var original = [...this.firstData, ...this.runnerData],
        //   updateRunners = Array.from(
        //     original
        //       .reduce(
        //         (m, o) => m.set(o.match_id, Object.assign({}, m.get(o.match_id) || {}, o)),
        //         new Map
        //       )
        //       .values()
        //   );
        this.a = a3
        let matches;
        if (this.parameter == 'inplay') {
          matches = this.a.filter(t => t.inplay == true || t.manualInplay == true);
          matches = _.orderBy(matches, ['hasRate', 'inplay', 'date'], ['asc', 'desc', 'asc']);
        }
        matches = matches.map(data => {
          if (!Array.isArray(data.runners))
            data.runners = data.runners.runners;
          return data;
        })
        // if (!sport_id)
        matches = matches.reduce((groupSport, sports) => {
          const { sport_name } = sports;
          groupSport[sport_name] = [...groupSport[sport_name] || [], sports];
          return groupSport;
        }, {});
        this.homeData = matches;

        this.a = [];
        // original = [];
      } else {
        for (let i = 0; i < this.firstData.length; i++) {
          this.updateRunnerData[i] = {
            "marketId": this.firstData[i].marketId,
            "status": "SUSPENDED",
            "inplay": false,
            "runners": [
              {
                "ex": {
                  "availableToBack": [
                    {
                      "price": "--",
                      "size": "--"
                    }
                  ],
                  "availableToLay": [
                    {
                      "price": "--",
                      "size": "--"
                    }
                  ],
                  "tradedVolume": []
                }
              },
              {
                "ex": {
                  "availableToBack": [
                    {
                      "price": "--",
                      "size": "--"
                    }
                  ],
                  "availableToLay": [
                    {
                      "price": "--",
                      "size": "--"
                    }
                  ],
                  "tradedVolume": []
                }
              }
            ]
          }
        }
        const a3 = this.firstData.map(t1 => ({ ...t1, ...this.updateRunnerData.find(t2 => t2.marketId === t1.marketId) }))
        // var original = [...this.firstData, ...this.runnerData],
        //   updateRunners = Array.from(
        //     original
        //       .reduce(
        //         (m, o) => m.set(o.match_id, Object.assign({}, m.get(o.match_id) || {}, o)),
        //         new Map
        //       )
        //       .values()
        //   );
        this.a = a3
        let matches;
        if (this.parameter == 'inplay') {
          matches = this.a.filter(t => t.inplay == true || t.manualInplay == true);
          matches = _.orderBy(matches, ['hasRate', 'inplay', 'date'], ['asc', 'desc', 'asc']);
        }
        matches = matches.map(data => {
          if (!Array.isArray(data.runners))
            data.runners = data.runners.runners;
          return data;
        })
        // if (!sport_id)
        matches = matches.reduce((groupSport, sports) => {
          const { sport_name } = sports;
          groupSport[sport_name] = [...groupSport[sport_name] || [], sports];
          return groupSport;
        }, {});
        this.homeData = matches;

        this.a = [];
      }
    }, (err) => {
      console.log(err);
    }, () => {
      if (this.router.url.split('?')[0] == '/inplay' || this.router.url.split('?')[0] == '/inplay/' + this.parameter) {
        // this.timer = setTimeout(() => resolve(this.homematches()), 60000);
      }
    })
  }
  home() {
    this.router.navigate(['home'])
  }
  scrollRight(): void {
    this.widgetsContent.nativeElement.scrollTo({ left: (this.widgetsContent.nativeElement.scrollLeft + 250), behavior: 'smooth' });
  }

  scrollLeft(): void {
    this.widgetsContent.nativeElement.scrollTo({ left: (this.widgetsContent.nativeElement.scrollLeft - 250), behavior: 'smooth' });
  }
  getAllSportsListData() {
    let userData = {};
    this.sport.getAllSportsList(userData).subscribe(res => {
      this.allSportsList = res.data;
    })
    // this.allSportsList = JSON.parse(localStorage.getItem('sportList'))
  }

  goToInplay(sportName) {
    this.router.navigate(['dashboard/' + sportName]);
  }

  goToDashboard(sportName) {
    this.router.navigate(['dashboard/' + sportName]);
  }

  matchDetail(matchData) {
    localStorage.setItem('matchData', JSON.stringify(matchData));
    this.router.navigate(['match-detail']);
  }
  goToAll(sportName) {
    this.router.navigate(['dashboard/' + sportName]);
  }
  // socketListenersUser() {
  // this.socketOnEvent(`homeMatches`, res => {
  //     try {

  //       if (res.status) {
  //         this.firstData = res.data;
  //         this.getRunnerEmit();
  //       }
  //     } catch (e) {
  //       this.homematches()
  //     }
  //   });

  //   this.socketOnEvent(`homeMatchesRunners`, res => {
  //     if (res.status) {
  //       this.runnerData = res.data;
  //       var original = [...this.firstData, ...this.runnerData],
  //         updateRunners = Array.from(
  //           original
  //             .reduce(
  //               (m, o) => m.set(o.match_id, Object.assign({}, m.get(o.match_id) || {}, o)),
  //               new Map
  //             )
  //             .values()
  //         );
  //       this.a = updateRunners;
  //       let matches;
  //       if (this.parameter == undefined || this.parameter == 'All') {
  //         matches = this.a;
  //       } else if (this.parameter == 'inplay') {
  //         matches = this.a.filter(t => t.inplay == true);
  //       } else {
  //         matches = this.a.filter(t => t.sport_name == this.parameter);
  //       }
  //       matches = matches.map(data => {
  //         if (!Array.isArray(data.runners))
  //           data.runners = data.runners.runners;
  //         return data;
  //       })
  //       // if (!sport_id)
  //       matches = matches.reduce((groupSport, sports) => {
  //         const { sport_name } = sports;
  //         groupSport[sport_name] = [...groupSport[sport_name] || [], sports];
  //         return groupSport;
  //       }, {});
  //       this.homeData = matches;
  //       this.a = [];
  //       original = [];
  //     }
  //   });

  // }

  getHomeMatchCallEvent(param) {
    this.userData = {};
    // this.socketEmitEvent('homeMatches', this.userData);
  }

  getRunnerEmit() {
    // this.socketEmitEvent('homeMatchesRunners', this.userData);
  }

  ngOnDestroy() {
    // this.socketService.socket.close();
  }

}
