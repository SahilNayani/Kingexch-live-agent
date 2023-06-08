import { Component, OnInit, ViewChild ,TemplateRef} from '@angular/core';
import { DateTime } from '../../dateTime';
import { Router, ActivatedRoute } from '@angular/router';
import { PopoverDirective } from 'ngx-bootstrap/popover';
import { Location } from '@angular/common';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { SportService } from '../services/sport.service';
import { ReportService } from '../services/report.service';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
const _ = require("lodash");
@Component({
  selector: 'app-fancy-stake-user-wise',
  templateUrl: './fancy-stake-user-wise.component.html',
  styleUrls: ['./fancy-stake-user-wise.component.scss']
})
export class FancyStakeUserWiseComponent implements OnInit {
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {
    "lengthChange": false,
    "ordering": false,
    "paging": false,
    "searching": false
  };
  dtTrigger: Subject<any> = new Subject();
  modalRef: BsModalRef;
  event_id: any;
  userDetails: any;
  Id: any;
  a: any = [];
  userStakeList: any;
  type: any;
  total: any;
  match_id: any;
  match_name: any;
  userParentName: any;
  parentList: any;
  constructor(private sport: SportService,private modalService: BsModalService,private route: ActivatedRoute, private router: Router,
     private locationBack: Location, private report: ReportService, private toastr: ToastrService) { 
      this.route.params.subscribe(params => {
        this.event_id = params.marketId;
        this.match_id = params.matchId;
        this.match_name = params.matchName
      })
     }

  ngOnInit(): void {
    this.userDetails = JSON.parse(localStorage.getItem('adminDetails'));
    this.type = this.userDetails.user_type_id;
    this.fancyStake('');
  }

  goToBack() {
    this.locationBack.back();
  }

  fancyStake(id) {
    this.Id = id;
    let data = {
      "user_id": id == '' ? this.userDetails.user_id : id,
      "event_id": this.event_id

    };
    if (data.event_id == '') {
      delete data.event_id
    }
    if (data.user_id == '') {
      delete data.user_id
    }
    this.a = []
    this.report.fancyStakeUser(data).subscribe((res) => {
      if (res.status == true) {
        this.userStakeList = res.data;
        this.total = this.userStakeList.reduce(
          (a: number, b) => a + b.stack, 0);
      }else{
        this.userStakeList=[]
      }
    })
  }

  openModalUserParentList(user, userParentList: TemplateRef<any>) {
    this.modalRef = this.modalService.show(
      userParentList,
      Object.assign({}, { class: 'modal-lg' })
    );
    this.userParentName = user.user_name;
    let data ={
      "user_id" : user.user_id
    }
    this.sport.showParentList(data).subscribe((res) => {
      if(res.status == true){
        this.parentList = res.data.agents ;
      } else {
        this.toastr.error(res.msg, '', {
          timeOut: 10000,
        })
      }
    })
  }

  goToViewBets(data){
    this.router.navigate(['viewBet/' + this.match_id + '/' + this.event_id + '/' + '2' +  '/' + this.match_name+ '/' + data])
  }
}
