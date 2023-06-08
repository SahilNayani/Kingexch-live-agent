import { Component, OnInit, ViewChild, TemplateRef,AfterViewInit ,OnDestroy } from '@angular/core';
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
  selector: 'app-pl-marketwise',
  templateUrl: './pl-marketwise.component.html',
  styleUrls: ['./pl-marketwise.component.scss']
})
export class PlMarketwiseComponent implements AfterViewInit,OnDestroy,OnInit {
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  modalRef: BsModalRef;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  moment: any = moment;
  public Base_Url = environment['adminServerUrl'];
  adminDetails: any;
  type: any;
  match_id: any;
  match_name: any;
  searchMarket:any;
  search: any;
  itemsPerPage: number = 50;
  currentPage: number = 1;
  total_items: number = 0;
  profitData: any;
  type_id: any;
  user_id: any;
  public token = localStorage.getItem('adminAccessToken');
  reqHeader = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ` + this.token
  });
  sportId: any;
  column: any;
  from_date: any;
  to_date: any;
  constructor(private modalService: BsModalService, private route: ActivatedRoute, private router: Router, private http: HttpClient, private report: ReportService, private toastr: ToastrService) {
    this.route.params.subscribe(params => {
      this.match_id = params.matchId;
      this.match_name= params.matchName;
      this.type_id = params.typeId;
      this.user_id = params.userId;
      this.sportId = params.sportId;
      this.from_date = params.fromDate;
      this.to_date = params.toDate
    })
   }

  ngOnInit(): void {
    this.adminDetails = JSON.parse(localStorage.getItem('adminDetails'));
    this.type = this.adminDetails.user_type_id;
    this.column = [
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
        data: 'event_name',
        "render": function (data, type, row) {
          var content = '';
            content = content + '<span style="color: #14805e !important;cursor: pointer;">' + row.event_name + '</span>';
          return content;
        }
      },
      {
        title: 'Result',
        data: 'winner_name'
      },
      {
        title: 'Profit/Loss',
        data: 'p_l_full',
        "render": function (data, type, row) {
          var content = ''
          if (row.p_l_full != null && row.p_l_full < 0) {
            content = content + '<span class="text-center text-danger">' + (row.p_l_full).toFixed(2) + '</span>';
          } else if (row.p_l_full != null && row.p_l_full >= 0) {
            content = content + '<span class="text-center text-success">' + (row.p_l_full).toFixed(2) + '</span>';
          } else {
            content = '';
          }
          return content;
        }

      }, 
      { 
        title: 'Commission', 
        data: 'commission_full',
        "render": function (data, type, row) {
          var content = ''
          if (row.commission_full != null && row.commission_full < 0) {
            content = content + '<span class="text-center text-danger">' + (row.commission_full).toFixed(2) + '</span>';
          } else if (row.commission_full != null && row.commission_full >= 0) {
            content = content + '<span class="text-center text-success">' + (row.commission_full).toFixed(2) + '</span>';
          } else {
            content = '';
          }
          return content;
        }
      },
      {
        title: 'Settle Time',
        data: 'updateDateTime'
      }];
      if(this.sportId < 0){
        let b = {
          title: 'Round-Id',
          data: 'roundId'
        }
        this.column[3] = b
      }
    // this.marketWisePl();
    const that = this;
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 50,
      searching: true, 
      paging: true,
      serverSide: true,
      processing: true,
      ajax: (dataTablesParameters1: any, callback) => {
        let dataTablesParameters = {
          // if (that.statementStartDate) {
            "search": {
              "match_name": this.match_name,
              "match_id":this.match_id,
                type: this.type_id,
                user_id : this.user_id
            },
            from_date:this.from_date,
            to_date:this.to_date
        }
        console.log("104",dataTablesParameters);
        if(dataTablesParameters.search.type == undefined){
          delete dataTablesParameters.search.type
        }
        if(dataTablesParameters.search.user_id == '' || dataTablesParameters.search.user_id == undefined || dataTablesParameters.search.user_id == null){
          delete dataTablesParameters.search.user_id
        }
        
        dataTablesParameters1.search.value != "" ? dataTablesParameters["search"] = (dataTablesParameters1.search.value) : ""
        // that.http.post<DataTablesResponse>('https://angular-datatables-demo-server.herokuapp.com/',dataTablesParameters, {})
        that.http.post<DataTablesResponse>(this.Base_Url + 'report/eventsProfitLoss', dataTablesParameters, { headers: this.reqHeader })
        .subscribe(resp => {
            if(resp["status"]){
              this.profitData = resp["data"]["data"];
              this.profitData = this.profitData.sort((a, b) => <any>new Date(b.result_date) - <any>new Date(a.result_date));
              for(let i = 0 ; i< this.profitData.length; i++){
                this.profitData[i].updateDateTime = moment(this.profitData[i].result_date).utcOffset("+5:30").format('DD-MM-YYYY HH:mm:ss');
                if(this.sportId < 0){
                  let a = (this.profitData[i]).event_id.split('.');
                  this.profitData[i].roundId = a[3]
                }
              }
             
             
                callback({
                  recordsTotal:resp["data"]["metadata"][0].total,
                  recordsFiltered:resp["data"]["metadata"][0].total,
                  data: this.profitData
                });
                
            } else {
              this.toastr.error(resp["msg"]);
              this.profitData = []
              callback({
                recordsTotal: 0,
                recordsFiltered: 0,
                data: this.profitData
              });
            }

           
          });
      },
      columns: this.column,
      rowCallback :(row: Node, data: any[] | Object, index: number) => {
        const self = this;
        $('td', row).off('click');
        $('td', row).on('click',()=> {
          this.userWisePl(data);
        });
        $( row ).addClass('text-center');
        return row; 
      }
    };
  }
  marketWisePl(){
    let data ={
      limit: this.itemsPerPage, 
      page: this.currentPage,
      "search": {
        "match_name": this.match_name,
        "match_id":this.match_id,
          type: this.type_id,
          user_id : this.user_id
      }
    }
    if(data.search.type == undefined){
      delete data.search.type
    }
    if(data.search.user_id == '' || data.search.user_id == undefined || data.search.user_id == null){
      delete data.search.user_id
    }
    this.report.profitLoss(data).subscribe((res)=>{
      if(res.status){
        this.profitData = res.data.data;
        for(let i = 0 ; i< this.profitData.length; i++){
          this.profitData[i].updateDateTime = moment(this.profitData[i].createdAt).utcOffset("+5:30").format('DD-MM-YYYY HH:mm:ss');
        }
        this.profitData = this.profitData.sort((a, b) => <any>new Date(b.result_date) - <any>new Date(a.result_date));
        if(res.data.metadata[0]){
          this.total_items = res.data.metadata[0].total
          this.currentPage = res.data.metadata[0].page
        }
      } else {
        this.toastr.error(res.msg)
      }
      
      
    })
  }
  searchFilter(){
    this.search = this.searchMarket;
    this.marketWisePl();
  }
  setSelectedOption(selectedOption) {
    this.itemsPerPage = parseInt(selectedOption);
    this.currentPage = 1;
    this.marketWisePl();
  }
  pageChange(event?: any) {
    if (event) {
      this.currentPage = event
    }else{
      this.currentPage=1
    }
    this.marketWisePl();
  }
  userWisePl(data){
    if(this.user_id == undefined){
      let a = this.Base_Url.split('api/v1/');
      // let b = 'http://192.168.0.8:4100/'+ 'plUserwise/'+ data.sport_id+ '/' + data.event_id +'/' + data.type;
      let b = a[0] + 'plUserwise/'+ data.sport_id+ '/' + data.event_id +'/' + data.type ;
      window.open(b, '_blank', 'location=yes,height=570,width=520,scrollbars=yes,status=yes');
    } else {
      let a = this.Base_Url.split('api/v1/');
      // let b = 'http://192.168.0.8:4100/'+ 'plUserBet/' + data.match_id + '/'+data.event_id + '/'+data.match_name + '/'+data.sport_name + '/'+ this.user_id  + '/'+ data.type;
      let b = a[0] + 'plUserBet/' + data.match_id + '/'+data.event_id + '/'+data.match_name + '/'+data.sport_name + '/'+ this.user_id  + '/'+ data.type;
      window.open(b, '_blank', 'location=yes,height=570,width=520,scrollbars=yes,status=yes');
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
