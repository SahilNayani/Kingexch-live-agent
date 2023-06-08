import { Component, Input, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";

@Component({
  selector: 'app-account-sidebar',
  templateUrl: './account-sidebar.component.html',
  styleUrls: ['./account-sidebar.component.scss']
})
export class AccountSidebarComponent implements OnInit {

  @Input() user_id: any;
  @Input() user_type_id: any;

  constructor( private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
  }

  statement(id,type){
    this.router.navigate(['statement/'+id + '/' + type])
  }
  account(id,type){
    this.router.navigate(['account-info/'+ id + '/' + type])
  }
  openBet(id,type){
    this.router.navigate(['open-bet/'+ id + '/' + type])
  }
  proloss(id,type){
    this.router.navigate(['profit-loss/'+ id + '/' + type])
  }
  onlineUser(id,type){
    this.router.navigate(['online-user/'+ id + '/' + type])
  }

}
