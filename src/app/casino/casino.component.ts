import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
// import * as exchange from '../../data.json';
@Component({
  selector: 'app-casino',
  templateUrl: './casino.component.html',
  styleUrls: ['./casino.component.scss']
})
export class CasinoComponent implements OnInit {
  exchangeGameList: any;
  constructor(private router: Router,) { }

  ngOnInit(): void {
    // this.exchangeGameList = exchange.data;
  }

}
