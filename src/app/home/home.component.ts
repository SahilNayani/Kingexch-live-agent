import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { Router, ActivatedRoute } from "@angular/router";
import { resolve } from 'q';
import { SportService } from '../services/sport.service';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import * as exchange from '../../data.json';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  providers: [HeaderComponent, SidebarComponent]
})
export class HomeComponent implements OnInit {
  sport_id: any;
  series_id: any;
  userData: any;
  firstData: any;
  moment: any = moment;
  homeData: any;
  public timer: any;
  a: any = [];
  b: any = [];
  runnerData: any;
  run: any;
  updateRunnerData: any = [];
  exchangeGameList: any;
  constructor(private route: ActivatedRoute, private router: Router, private sport: SportService, private toastr: ToastrService) {
    this.route.params.subscribe(params => {
      this.sport_id = params.sportId;
      this.series_id = params.seriesId;
      this.homematches();
    })
  }

  ngOnInit() {
    this.exchangeGame();
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
  homematches() {
    this.userData = {};
    this.sport.getHomeMatchesList(this.userData).subscribe(res => {
      if (res.status) {
        this.firstData = res.data;
        this.firstData.forEach(matDta => {
          matDta.manualInplay = matDta.inplay;
        });
        this.runners();
      } else {
        this.toastr.error(res.msg, '', {
          timeOut: 10000,
        });
      }
    }, (err) => {
      console.log(err);
    })
  }

  runners() {
    this.userData = {};
    this.sport.runnerList(this.userData).subscribe((res) => {
      if (res.status) {
        this.runnerData = res.data;
        for (let i = 0; i < this.firstData.length; i++) {
          if (this.firstData[i].sport_id == this.sport_id && this.firstData[i].series_id == this.series_id) {
            this.a.push(this.firstData[i]);
          }
        }
        for (let i = 0; i < this.a.length; i++) {
          for (let j = 0; j < this.runnerData.length; j++) {
            if (this.a[i].marketId == this.runnerData[j].marketId) {
              this.updateRunnerData[i] = []
              this.updateRunnerData[i] = (this.runnerData[j]);
              break
            } else {
              this.updateRunnerData[i] = {
                "marketId": this.a[i].marketId,
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
        const a3 = this.a.map(t1 => ({ ...t1, ...this.updateRunnerData.find(t2 => t2.marketId === t1.marketId) }))
        // var original = [...this.a, ...this.b],
        //   updateRunners = Array.from(
        //     original
        //       .reduce(
        //         (m, o) => m.set(o.match_id, Object.assign({}, m.get(o.match_id) || {}, o)),
        //         new Map
        //       )
        //       .values()
        //   );
        this.a = a3;
        let matches;
        matches = this.a;
        matches = matches.reduce((groupSport, sports) => {
          const { sport_name } = sports;
          groupSport[sport_name] = [...groupSport[sport_name] || [], sports];
          return groupSport;
        }, {});
        this.homeData = matches;
        this.a = [];
        this.b = [];
        // original = [];
      } else {
        for (let i = 0; i < this.firstData.length; i++) {
          if (this.firstData[i].sport_id == this.sport_id && this.firstData[i].series_id == this.series_id) {
            this.a.push(this.firstData[i]);
          }
        }
        for (let i = 0; i < this.a.length; i++) {

          this.updateRunnerData[i] = {
            "marketId": this.a[i].marketId,
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

        const a3 = this.a.map(t1 => ({ ...t1, ...this.updateRunnerData.find(t2 => t2.marketId === t1.marketId) }))
        // var original = [...this.a, ...this.b],
        //   updateRunners = Array.from(
        //     original
        //       .reduce(
        //         (m, o) => m.set(o.match_id, Object.assign({}, m.get(o.match_id) || {}, o)),
        //         new Map
        //       )
        //       .values()
        //   );
        this.a = a3;
        let matches;
        matches = this.a;
        matches = matches.reduce((groupSport, sports) => {
          const { sport_name } = sports;
          groupSport[sport_name] = [...groupSport[sport_name] || [], sports];
          return groupSport;
        }, {});
        this.homeData = matches;
        this.a = [];
        this.b = [];
      }
    }, (err) => {
      console.log(err);
    })
  }
  matchDetail(matchData) {
    localStorage.setItem('matchData', JSON.stringify(matchData));
    this.router.navigate(['match-detail']);
  }

}
