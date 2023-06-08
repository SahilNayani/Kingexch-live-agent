import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { SportService } from '../services/sport.service';
import * as moment from 'moment';
import { SpinnerVisibilityService } from 'ng-http-loader';
@Component({
  selector: 'app-fancy-result-rollback',
  templateUrl: './fancy-result-rollback.component.html',
  styleUrls: ['./fancy-result-rollback.component.scss']
})
export class FancyResultRollbackComponent implements OnInit {
  adminDetails: any;
  userData: {};
  moment: any = moment;
  firstData: any;
  homeData: any;
  match_id: any;
  searchSport: any;
  fancyList: any;
  matchData: any;
  searchFancy: any
  constructor(private locationBack: Location, public toastr: ToastrService,
    private spinner: SpinnerVisibilityService, public sport: SportService,) { }


  ngOnInit(): void {
    this.homematches()
    this.getFancy(null, "onload");
  }

  homematches() {
    this.userData = {
      'sport_id': 4
    };
    this.sport.getHomeMatchesList(this.userData).subscribe(res => {

      if (res.status) {
        this.firstData = res.data;

        this.homeData = this.firstData.filter(object => object.enable_fancy == 1);
      } else {
        this.toastr.error(res.msg, '', {
          timeOut: 10000,
        });
      }
    }, (err) => {
      console.log(err);
    })
  }

  goToBack() {
    this.adminDetails = JSON.parse(localStorage.getItem('adminDetails'));
    this.locationBack.back();
  }

  rollBackResult(fancy) {
    if (confirm("Are you sure want to Rollback fancy Result "+"\n"+ fancy.match_name+ " --> "  + fancy.fancy_name + " & Result is " + fancy.result)) {
    let request = {
      "fancy_id": fancy.fancy_id
    }
    this.sport.sessionRollback(request).subscribe(res => {
      if (res.status) {
        this.toastr.success(res.msg, '', {
          positionClass: 'toast-bottom-right',
          timeOut: 1000
        });
        this.getFancy(null);
      } else {
        this.toastr.error(res.msg, '', {
          timeOut: 10000,
        });
      }
    })
  }
  }


  abandonedRollback(fancy) {
    if (confirm("Are you sure want to Abonded Rollback fancy "+"\n"+ fancy.match_name+ " --> "  + fancy.fancy_name)) {
    let request = {
      "fancy_id": fancy.fancy_id,
      "rollback": 1
    }
    this.sport.fancyResultAbonded(request).subscribe(res => {
      if (res.status) {
        this.toastr.success(res.msg, '', {
          positionClass: 'toast-bottom-right',
          timeOut: 1000
        });
        this.getFancy(null);
      } else {
        this.toastr.error(res.msg, '', {
          timeOut: 10000,
        });
      }
    })
  }
  }


  getFancy(event?: any, from?: string) {
    this.match_id = event
    this.spinner.show();
    this.matchData = JSON.parse(localStorage.getItem('matchData'));
    let request
    if (from == "onload") {
      request = {
        search: {
          is_result_declared: 1
        }
      }
    } else {
      request = {
        search: {
          match_id: event,
          match_name: this.searchSport,
          fancy_name: this.searchFancy,
          is_result_declared: 1
        }
      }
      if (request.search.match_id == '' || request.search.match_id == null) {
        delete request.search.match_id
      }
      if (request.search.match_name == '' || request.search.match_name == null) {
        delete request.search.match_name
      }
      if (request.search.match_name == '' || request.search.match_name == null) {
        delete request.search.match_name
      }
    }
    this.sport.getfancyResult(request).subscribe((res) => {
      if (res.status == true) {
        this.spinner.hide();
        if (res.msg) {
          this.toastr.success(res.msg, '', {
            positionClass: 'toast-bottom-right',
            timeOut: 1000
          });
        }
        this.fancyList = res.data.data;
      } else {
        this.toastr.error(res.msg);
        this.spinner.hide();
      }
    }, error => {
      this.spinner.hide();
    })
  }
}
