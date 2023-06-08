import { Component, OnInit, Input } from '@angular/core';
import { Router } from "@angular/router";
import { SportService } from '../services/sport.service'
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  allSportsList: any
  allSeriesList: any;
  constructor(private router: Router, private sport: SportService) { }

  ngOnInit(): void {
    this.getAllSportsListData()
  }
  getAllSportsListData() {
    let userData = {}
    this.sport.getAllSportsList(userData).subscribe(res => {
      this.allSportsList = res.data;
      this.allSportsList = this.allSportsList.filter(t => t.is_active == '1');
    })
  }
  getSeriesList(id) {
    let data = {
      sport_id: id
    };
    this.sport.getSeriesList(data).subscribe(res => {
      this.allSeriesList = res.data
    })
  }
  goToDashboard(sportId, seriesId) {
    if(sportId == -100){
      this.router.navigate(['casino'])
    } else {
      this.router.navigate(['home/' + sportId + '/' + seriesId])
    }
  }

  reports() {
    this.router.navigate(['my-market'])
  }
  dashboard() {
    this.router.navigate(['dashboard'])
  }
  inplay() {
    this.router.navigate(['inplay'])
  }
  accountStatement() {
    this.router.navigate(['statement'])
  }
  profitLoss() {
    this.router.navigate(['profit-loss'])
  }
  openBets() {
    this.router.navigate(['open-bet'])
  }
  settledBets() {
    this.router.navigate(['settled-bet'])
  }
}
