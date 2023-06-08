import { Component, OnInit, ViewChild, TemplateRef,AfterViewInit ,OnDestroy  } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { DateTime } from '../../dateTime';
import { Router, ActivatedRoute } from "@angular/router";
import { HttpClient, HttpHeaders, HttpHeaderResponse, HttpParams } from '@angular/common/http';
import { ReportService } from '../services/report.service';
import { ToastrService } from 'ngx-toastr';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
const _ = require("lodash");
import * as moment from 'moment';
import { environment } from '../../environments/environment';
class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
}
@Component({
  selector: 'app-pl-userwise',
  templateUrl: './pl-userwise.component.html',
  styleUrls: ['./pl-userwise.component.scss']
})
export class PlUserwiseComponent implements AfterViewInit,OnDestroy,OnInit {
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  modalRef: BsModalRef;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  moment: any = moment;
  public Base_Url = environment['adminServerUrl'];
  adminDetails: any;
  searchUser:any;
  search: any;
  itemsPerPage: number = 50;
  currentPage: number = 1;
  total_items: number = 0;
  market_id: any;
  userList: any;
  typeId: any;
  public token = localStorage.getItem('adminAccessToken');
  reqHeader = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ` + this.token
  });
  sportId: any;
  column: any;
  constructor(private modalService: BsModalService, private route: ActivatedRoute, private router: Router, private http: HttpClient, private report: ReportService, private toastr: ToastrService) { 
    this.route.params.subscribe(params => {
      this.market_id = params.marketId;
      this.typeId = params.type;
      this.sportId = params.sportId;
    })
  }

  ngOnInit(): void {
    this.adminDetails = JSON.parse(localStorage.getItem('adminDetails'));
    // this.userWisePl();
    const that = this;
    this.column =  [
      {
        title: 'User Name',
        data: 'user_name',
        "render": function (data, type, row) {
          var content = '';
            content = content + '<span style="color: #14805e !important;cursor: pointer;">' + row.user_name + '</span>';
          return content;
        }
      },
      {
        title: 'Sport Name',
        data: 'sport_name'
      },
      {
        title: 'Event Name',
        data: 'match_name'
      },
      {
        title: 'Market Name',
        data: 'market_name',
      },
      {
        title: 'Result',
        data: 'winner_name'
      },
      {
        title: 'Profit/Loss',
        data: 'total',
        "render": function (data, type, row) {
          var content = ''
          if (row.total != null && row.total < 0) {
            content = content + '<span class="text-center text-danger">' + (row.total).toFixed(2) + '</span>';
          } else if (row.total != null && row.total >= 0) {
            content = content + '<span class="text-center text-success">' + (row.total).toFixed(2) + '</span>';
          } else {
            content = '';
          }
          return content;
        }

      }, 
      { 
        title: 'Commission', 
        data: 'commission',
        "render": function (data, type, row) {
          var content = ''
          if (row.commission != null && row.commission < 0) {
            content = content + '<span class="text-center text-danger">' + (row.commission).toFixed(2) + '</span>';
          } else if (row.commission != null && row.commission >= 0) {
            content = content + '<span class="text-center text-success">' + (row.commission).toFixed(2) + '</span>';
          } else {
            content = '';
          }
          return content;
        }
      },
      {
        title: 'Settle Time',
        data: 'updateDateTime'
      }]
      let a = this.market_id.split('.');
      if(this.sportId < 0){
        let b = {
          title: 'Round-Id',
          data: 'roundId'
        }
        this.column[4] = b
      }
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 50,
      searching: true, 
      paging: true,
      serverSide: true,
      processing: true,
      ajax: (dataTablesParameters1: any, callback) => {
        let dataTablesParameters = {
          page: (dataTablesParameters1.start/ dataTablesParameters1.length)+1,
          limit: dataTablesParameters1.length,
            market_id: this.market_id,
            "search": this.search
        }
        console.log("104",dataTablesParameters);
        if(dataTablesParameters.search == ''||dataTablesParameters.search == undefined||dataTablesParameters.search == null){
          delete dataTablesParameters.search;
        }
        dataTablesParameters1.search.value != "" ? dataTablesParameters["search"] = (dataTablesParameters1.search.value) : ""
        // that.http.post<DataTablesResponse>('https://angular-datatables-demo-server.herokuapp.com/',dataTablesParameters, {})
        that.http.post<DataTablesResponse>(this.Base_Url + 'report/usersPLByMarket', dataTablesParameters, { headers: this.reqHeader })
        .subscribe(resp => {
            if(resp["status"]){
              this.userList = resp.data;
              for(let i = 0 ; i< this.userList.length; i++){
                this.userList[i].updateDateTime = moment(this.userList[i].settle_date_time).utcOffset("+5:30").format('DD-MM-YYYY HH:mm:ss');
                this.userList[i].roundId = a[3]
              }
              console.log("91",this.userList);
                callback({
                  recordsTotal:resp["metadata"][0].total,
                  recordsFiltered:resp["metadata"][0].total,
                  data: this.userList
                });
                
            } else {
              this.toastr.error(resp["msg"]);
              this.userList = []
              callback({
                recordsTotal: 0,
                recordsFiltered: 0,
                data: this.userList
              });
            }

           
          });
      },
      columns: this.column,
      rowCallback :(row: Node, data: any[] | Object, index: number) => {
        const self = this;
        $('td', row).off('click');
        $('td', row).on('click',()=> {
          this.betList(data);
        });
        $( row ).addClass('text-center');
        return row; 
      }
    };
  }

  userWisePl(){
    let data = {
      limit: this.itemsPerPage, 
      page: this.currentPage,
      market_id: this.market_id,
      "search": this.search
    }
    if(data.search == ''||data.search == undefined||data.search == null){
      delete data.search;
    }
    this.report.userpl(data).subscribe((res) => {
      if(res.status){
        this.userList = res.data;
        if(res.data.metadata[0]){
          this.total_items = res.metadata[0].total
          this.currentPage = res.metadata[0].page
        }
      } else {
        this.toastr.error(res.msg)
        this.userList = [];
      }
    })
  }
  searchFilter(){
    this.search = this.searchUser;
    this.userWisePl();
  }
  setSelectedOption(selectedOption) {
    this.itemsPerPage = parseInt(selectedOption);
    this.currentPage = 1;
    this.userWisePl();
  }
  pageChange(event?: any) {
    if (event) {
      this.currentPage = event
    }else{
      this.currentPage=1
    }
    this.userWisePl();
  }
  betList(data){
    let a = this.Base_Url.split('api/v1/');
    if(this.sportId > 0){
      // let b = 'http://192.168.0.8:4100/'+ 'plUserBet/' + data.match_id + '/'+data.market_id + '/'+data.match_name + '/'+data.sport_name + '/'+data.user_id  + '/'+ this.typeId;
      let b = a[0] + 'plUserBet/' + data.match_id + '/'+data.market_id + '/'+data.match_name + '/'+data.sport_name + '/'+data.user_id  + '/'+ this.typeId;
      window.open(b, '_blank', 'location=yes,height=570,width=520,scrollbars=yes,status=yes');
    } else {
      if (this.sportId == -102) {
        // let b = 'http://192.168.0.8:4100/' + 'plSnUserBet/' + data.market_id + '/' + data.sport_name + '/' + data.match_name + '/' + data.market_name +'/'+data.user_id;
        let b = a[0] + 'plSnUserBet/' + data.market_id + '/' + data.sport_name + '/' + data.match_name + '/' + data.market_name +'/'+data.user_id;
        window.open(b, '_blank', 'location=yes,height=570,width=520,scrollbars=yes,status=yes');
      }
    }
    
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
