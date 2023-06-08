import { Component, OnInit, ElementRef, ViewChild, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';

import { Router, ActivatedRoute } from "@angular/router";
import { HeaderComponent } from '../header/header.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { HttpClient, HttpHeaders, HttpHeaderResponse, HttpParams } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { DateTime } from '../../dateTime';
import { SportService } from '../services/sport.service';
import { LoginService } from '../services/login.service';
import { ReportService } from '../services/report.service';
import { SocketServiceService } from '../services/socket-service.service';
import { CookieService } from 'ngx-cookie-service';
import * as Highcharts from 'highcharts';
const _ = require("lodash");
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  providers: [HeaderComponent, SidebarComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent implements OnInit {
  @ViewChild('widgetsContent', { read: ElementRef }) public widgetsContent: ElementRef<any>;
  time: Date;
  date: Date;
  endDate: Date;
  endTime: Date;
  isDateVisible: boolean = true;
  isMeridian: boolean = false;
  startdateTime = new Date();
  enddateTime = new Date();
  settledStartDate: Date = new Date()
  settledEndDate: Date = new Date()
  startAt: Date = new Date()
  todayDateTime: Date = new Date()
  options: any = {
    labels: [
      "Tennis",
      "Cricket"
    ],
    datasets: [
      {
        data: [133.3, 86.2,],
        backgroundColor: [
          "#090909",
          "#6ba4db"
        ]
      }]
  };

  userDetails: any;
  userPlList: any;
  gameList: any;
  userName: any;
  parentId: any;
  updateFlag = false
  chartData: any = []

  highcharts = Highcharts;
  chartOptions = {
    chart: {
      plotBorderWidth: null,
      plotShadow: false
    },
    title: {
      text: 'Live Sports Profit'
    },
    tooltip: {
      pointFormat: '{point.series.name}: <b>{point.y}{.2f}</b>'
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: 'pointer',

        dataLabels: {
          enabled: true
        },

        showInLegend: true
      }
    },
    series: [{
      type: 'pie',
      name: 'Profit',
      data: [
      ]
    }]
  };
  adminDetails: any;
  type: any;

  constructor(private report: ReportService, private loginService: LoginService, private head: HeaderComponent, private cdRef: ChangeDetectorRef, private cookie: CookieService, private socketService: SocketServiceService, private route: ActivatedRoute, private router: Router, private http: HttpClient, private sport: SportService, private toastr: ToastrService) {
  }

  sportsPl() {
    this.userDetails = JSON.parse(localStorage.getItem('adminDetails'))
    let data = {
      "user_id": this.userDetails.user_id,
      'from_date': this.startdateTime.toISOString(),
      "to_date": this.enddateTime.toISOString()
    };
    this.report.sportsPl(data).subscribe((res) => {
      // console.log(res)
      if (res.status == true) {
        this.userPlList = res.data.users;
        this.userPlList = _.orderBy(this.userPlList, ['user_type_id', 'user_name'], ['desc', 'asc']);
        this.gameList = res.sports;

        this.userName = res.user_name;
        this.parentId = res.parent_id;
        for (let i = 0; i < this.userPlList.length; i++) {
          for (let j = 0; j < this.gameList.length; j++) {
            this.gameList[j].lower_name = ((this.gameList[j].name).toLowerCase());
            this.gameList[j].lower_name = (this.gameList[j].lower_name).replace(/ /g, "_");
            if ((this.userPlList[i][(this.gameList[j].name).toLowerCase()]) == undefined) {
              this.userPlList[i][(this.gameList[j].name).toLowerCase()] = 0;
            }
          }
        }

        for (let i = 0; i < this.gameList.length; i++) {
          this.gameList[i].total = 0
          for (let j = 0; j < this.userPlList.length; j++) {
            if (this.userPlList[j][this.gameList[i].lower_name] == undefined || this.userPlList[j][this.gameList[i].lower_name] == null || this.userPlList[j][this.gameList[i].lower_name] == NaN || this.userPlList[j][this.gameList[i].lower_name] == '') {
              this.gameList[i].total = this.gameList[i].total + 0
            } else {
              this.gameList[i].total = this.gameList[i].total + this.userPlList[j][this.gameList[i].lower_name]
            }
          }
        }
        for (var i: any = 0; i <= this.gameList.length - 1; i++) {
          if (this.gameList[i].total != 0) {
            this.gameList[i].total = parseFloat((this.gameList[i].total).toFixed(2))
          }
          (this.chartOptions.series[0].data).push([this.gameList[i].name, this.gameList[i].total]);
        }
        this.updateFlag = true
        this.cdRef.detectChanges();
      } else {
        this.userPlList = []
        if (res.logout == true) {
          this.head.logoutUser();
        }
      }
    })
  }

  async ngOnInit() {
    this.adminDetails = JSON.parse(localStorage.getItem('adminDetails'));
    this.type = this.adminDetails.user_type_id;
    this.startdateTime.setHours(0, 0, 0, 0);
    this.enddateTime.setHours(23, 59, 59);
    this.todayDateTime.setHours(23, 59, 59);
    this.sportsPl();

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

  // close() {
  //   this._startpopoverRef.hide();

  // }
  // closeEndDatepicker() {
  //   this._endpopoverRef.hide()
  // }
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

}
