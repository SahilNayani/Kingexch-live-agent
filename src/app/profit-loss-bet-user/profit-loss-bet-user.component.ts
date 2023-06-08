import { Component, OnInit, ViewChild, TemplateRef,AfterViewInit ,OnDestroy  } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { DateTime } from '../../dateTime';
import { Router, ActivatedRoute } from "@angular/router";
import { HttpClient, HttpHeaders, HttpHeaderResponse, HttpParams } from '@angular/common/http';
import { ReportService } from '../services/report.service';
import { ToastrService } from 'ngx-toastr';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import * as moment from 'moment';
import { environment } from '../../environments/environment';
import { SportService } from '../services/sport.service';
class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
}
const _ = require("lodash");
@Component({
  selector: 'app-profit-loss-bet-user',
  templateUrl: './profit-loss-bet-user.component.html',
  styleUrls: ['./profit-loss-bet-user.component.scss']
})
export class ProfitLossBetUserComponent implements OnInit {
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  modalRef: BsModalRef;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  moment: any = moment;
  public Base_Url = environment['adminServerUrl'];
  adminDetails: any;
  match_id: any;
  market_id: any;
  match_name: any;
  sport_name: any;
  user_id: any;
  typeId: any;
  itemsPerPage: number = 50;
  currentPage: number = 1;
  total_items: number = 0;
  betList: any;
  data:any;
  public token = localStorage.getItem('adminAccessToken');
  reqHeader = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ` + this.token
  });
  constructor( public sport: SportService,private modalService: BsModalService, private route: ActivatedRoute, private router: Router, private http: HttpClient, private report: ReportService, private toastr: ToastrService) { 
    this.route.params.subscribe(params => {
      this.match_id = params.matchId;
      this.market_id = params.marketId;
      this.match_name = params.matchName;
      this.sport_name = params.sportName;
      this.user_id = params.userId;
      this.typeId = params.type;
    })
  }

  ngOnInit(): void {
    this.adminDetails = JSON.parse(localStorage.getItem('adminDetails'));
    // this.userBets();
    const that = this;
    let dataTablesParameters
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 50,
      searching: false,
      paging:true, 
      serverSide: true,
      processing: true,
      ajax: (dataTablesParameters1: any, callback) => {
        if(this.typeId == 1){
           dataTablesParameters = {
            page: (dataTablesParameters1.start/ dataTablesParameters1.length)+1,
            limit: dataTablesParameters1.length,
            match_id : this.match_id,
            search : {
              market_id : this.market_id,
              user_id : this.user_id
            }
          }
        } else {
          dataTablesParameters = {
            match_id : this.match_id,
            page: (dataTablesParameters1.start/ dataTablesParameters1.length)+1,
            limit: dataTablesParameters1.length,
            search : {
              fancy_id : this.market_id,
              user_id : this.user_id
            }
          }
        }
        // that.http.post<DataTablesResponse>('https://angular-datatables-demo-server.herokuapp.com/',dataTablesParameters, {})
        that.http.post<DataTablesResponse>(this.Base_Url + 'bet/bets', dataTablesParameters, { headers: this.reqHeader })
        .subscribe(resp => {
            if(resp["status"]){
              this.betList = resp["data"]["data"];
              this.betList = (this.betList).filter(t => t.delete_status == '0')
              for(let i=0; i<this.betList.length ; i++){
                this.betList[i].sport_name = this.sport_name;
                this.betList[i].match_name = this.match_name;
              }
              for(let i = 0;i<this.betList.length;i++){
                this.betList[i].updateDateTime = moment(this.betList[i].createdAt).utcOffset("+5:30").format('DD-MM-YYYY HH:mm:ss');
                if(this.betList[i].is_fancy == 0){
                  this.betList[i].updateSelection = this.betList[i].selection_name;
                  this.betList[i].updateOdds = this.betList[i].odds;
                  this.betList[i].updatePl = this.betList[i].p_l + '/' + this.betList[i].liability
                  if(this.betList[i].is_back == 0){
                    this.betList[i].updateType = 'Back'
                  } else {
                    this.betList[i].updateType = 'Lay'
                  }
                } else {
                  this.betList[i].updateSelection = this.betList[i].odds;
                  this.betList[i].updateOdds = this.betList[i].odds + '/' + this.betList[i].size;
                  this.betList[i].updatePl = this.betList[i].chips + '/' + this.betList[i].liability
                  if(this.betList[i].is_back == 0){
                    this.betList[i].updateType = 'Yes'
                  } else {
                    this.betList[i].updateType = 'No'
                  }
                }
              }
                callback({
                  recordsTotal: this.betList.length,
                  recordsFiltered: this.betList.length,
                  data: this.betList
                });
                
            } else {
              this.toastr.error(resp["msg"]);
              this.betList = []
              callback({
                recordsTotal: 0,
                recordsFiltered: 0,
                data: this.betList
              });
            }

           
          });
      },
      columns: [
        { 
          title: 'Sport Name',
          data: 'sport_name',
        },
        { 
          title: 'Event Name',
          data: 'match_name',
        }, 
        { 
          title: 'Market Name',
          data: 'market_name',
        },
        { 
          title: 'Selection',
          data: 'updateSelection',
        }, 
        { 
          title: 'Bet Type',
          data: 'updateType',
        }, 
        { 
          title: 'User Price',
          data: 'updateOdds',
        },
        { 
          title: 'Amount',
          data: 'stack',
        },
        { 
          title: 'Profit/Loss',
          data: 'liability',
          "render": function (data, type, row) {
            var content = ''
            // if(row.is_fancy == 0){
              if (row.p_l != null && row.p_l < 0) {
                content = content + '<span class="text-center text-danger">' + (row.p_l).toFixed(2) + '</span>/ <span class="text-center text-danger">'+( row.liability).toFixed(2) +' </span>';
              } else if (row.p_l != null && row.p_l >= 0) {
                content = content + '<span class="text-center text-success">' + (row.p_l).toFixed(2) + '</span> / <span class="text-center text-danger">'+ (row.liability ).toFixed(2)+' </span>';
              } else {
                content = '';
              }
            // } else {
            //   if (row.chips != null && row.chips < 0) {
            //     content = content + '<span class="text-center text-danger">' + (row.chips).toFixed(2) + '</span>/ <span class="text-center text-danger">'+ row.liability +' </span>';
            //   } else if (row.chips != null && row.chips >= 0) {
            //     content = content + '<span class="text-center text-success">' + (row.chips).toFixed(2) + '</span> / <span class="text-center text-danger">'+ row.liability +' </span>';
            //   } else {
            //     content = '';
            //   }
            // }
            
            return content;
          } 
        },
        { 
          title: 'Placed Time',
          data: 'updateDateTime',
        },
      ],
      rowCallback: (row: Node, data: any[] | Object, index: number) => {
        const self = this;
        $( row ).addClass('text-center');
        return row;
      }
    };
  }
  userBets(){
    if(this.typeId == 1){
      this.data = {
        limit: this.itemsPerPage, 
        page: this.currentPage,
        match_id : this.match_id,
        search : {
          market_id : this.market_id,
          user_id : this.user_id
        }
      }
    } else {
      this.data = {
        limit: this.itemsPerPage, 
        page: this.currentPage,
        match_id : this.match_id,
        search : {
          fancy_id : this.market_id,
          user_id : this.user_id
        }
      }
    }
    
    this.sport.getBet(this.data).subscribe((res) => {
      if(res.status){
        this.betList = res.data.data;
        for(let i=0; i<this.betList.length ; i++){
          this.betList[i].sport_name = this.sport_name;
          this.betList[i].match_name = this.match_name;
        }
      }
    })
  }
  ngAfterViewInit(): void {
    this.dtTrigger.next();
  }
  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }
  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.dtTrigger.next();
    });
  }

}
