import { Component, OnInit,  ViewChild, AfterViewInit,OnDestroy  } from '@angular/core';
import { DateTime } from '../../dateTime';
import { PopoverDirective } from 'ngx-bootstrap/popover';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SportService } from '../services/sport.service';
import { ToastrService } from 'ngx-toastr';
import { CookieService } from 'ngx-cookie-service';
import { SocketServiceService } from '../services/socket-service.service';
import { ReportService } from '../services/report.service';
import { MatPaginator } from '@angular/material/paginator';
import { environment } from '../../environments/environment';
import { DataTableDirective } from 'angular-datatables';
import { HttpClient, HttpResponse,HttpHeaders } from '@angular/common/http';
import { Subject } from 'rxjs';
import * as moment from 'moment';
class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
}
@Component({
  selector: 'app-profit-loss-user-bet-sn',
  templateUrl: './profit-loss-user-bet-sn.component.html',
  styleUrls: ['./profit-loss-user-bet-sn.component.scss']
})
export class ProfitLossUserBetSnComponent implements OnInit {
  match_id: any;
  match_name: any;
  moment: any = moment;
  @ViewChild('popoverRef') private _popoverRef: PopoverDirective;
  @ViewChild('startpopoverRef') private _startpopoverRef: PopoverDirective;
  @ViewChild('endpopoverRef') private _endpopoverRef: PopoverDirective;
  time: Date;
  date: Date;
  isDateVisible: boolean = true;
  isMeridian: boolean = false;
  dateTime = new Date();
  statementStartDate = new Date()
  statementEndDate = new Date()
  pageSize: number = 50;
  statementsTotalItems: any;
  statementsPageIndex: number;
  timeStatement: Date;
  dateStatement: Date;
  endDateStatement: Date;
  endTimeStatement: Date;
  endTime: any;
  market_id: any;
  typeId: any;
  data:any;
  betList: any;
  public Base_Url = environment['adminServerUrl'];
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  public token = localStorage.getItem('adminAccessToken');
  reqHeader = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ` + this.token
  });
  userId: string;
  sportName: any;
  matchName: any;
  marketName: any;
  
  constructor(private http: HttpClient,private route: ActivatedRoute, private sport: SportService, private reportService: ReportService,
    private cookie: CookieService, private toastr: ToastrService, private socketService: SocketServiceService, private router: Router) {
      this.route.params.subscribe(params => {
        this.market_id = params.marketId;
        this.sportName = params.sportName
        this.matchName = params.matchName
        this.marketName = params.marketName
        this.userId = params.userId
        this.typeId = params.typeId
      })
     }

  ngOnInit(): void {
    // this.userBets();
    const that = this;
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 50,
      searching: false,
      paging:false, 
      serverSide: true,
      processing: true,
      ajax: (dataTablesParameters: any, callback) => {
        let a = this.market_id.split('.');
        console.log("85",a);
        
          dataTablesParameters = {
              user_id : this.userId,
              providerRoundId : a[3],
            
          }
        // that.http.post<DataTablesResponse>('https://angular-datatables-demo-server.herokuapp.com/',dataTablesParameters, {})
        that.http.post<DataTablesResponse>(this.Base_Url + 'supernowa/betLists', dataTablesParameters, { headers: this.reqHeader })
        .subscribe(resp => {
          console.log("93",resp);
          
            if(resp["status"]){
              this.betList = resp.data;
              for(let i = 0;i<this.betList.length;i++){
                this.betList[i].updateDateTime = moment(this.betList[i].betPlaceDatetime).utcOffset("+5:30").format('DD-MM-YYYY HH:mm:ss');
                this.betList[i].sport_name = this.sportName;
                this.betList[i].match_name = this.matchName;
                this.betList[i].market_name = this.marketName;
                this.betList[i].roundId = a[3];
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
          data: 'runner',
        }, 
        {
          title: 'Round-Id',
          data: 'roundId',
        },
        { 
          title: 'Bet Type',
          data: 'betType',
        }, 
        { 
          title: 'User Price',
          data: 'odds',
        },
        { 
          title: 'Amount',
          data: 'stake',
        },
        { 
          title: 'Profit/Loss',
          data: 'loss',
          "render": function (data, type, row) {
            var content = ''
              if (row.loss != null && row.loss < 0) {
                content = content + '<span class="text-center text-danger">' + (row.loss).toFixed(2) ;
              } else if (row.win != null && row.win >= 0) {
                content = content + '<span class="text-center text-success">' + (row.win).toFixed(2) ;
              } else {
                content = '';
              }
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
