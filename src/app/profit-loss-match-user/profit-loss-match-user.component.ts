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
import { environment } from '../../environments/environment';
class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
}
@Component({
  selector: 'app-profit-loss-match-user',
  templateUrl: './profit-loss-match-user.component.html',
  styleUrls: ['./profit-loss-match-user.component.scss']
})
export class ProfitLossMatchUserComponent implements OnInit {

  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  modalRef: BsModalRef;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  public Base_Url = environment['adminServerUrl'];
  adminDetails: any;
  type: any;
  sport_id: any;
  from_date: any;
  to_date: any;
  matchPlList: any;
  profitloss: any;
  downlineprofitloss: any;
  commission: any;
  searchMatch:any;
  search: any;
  itemsPerPage: number = 50;
  currentPage: number = 1;
  total_items: number = 0;
  user_id: any;
  type_id: any;
  sport_name: any;
  public token = localStorage.getItem('adminAccessToken');
  reqHeader = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ` + this.token
  });
  constructor(private modalService: BsModalService, private route: ActivatedRoute, private router: Router, private http: HttpClient, private report: ReportService, private toastr: ToastrService) {
    this.route.params.subscribe(params => {
      this.sport_id = params.sportId;
      this.from_date= params.fromDate;
      this.to_date = params.toDate;
      this.user_id = params.userId;
      this.type_id = params.typeId
      this.sport_name = params.sportName;
    })
   }

  ngOnInit(): void {
    this.adminDetails = JSON.parse(localStorage.getItem('adminDetails'));
    this.type = this.adminDetails.user_type_id;
    // this.matchWisePl();
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
          sport_id: this.sport_id,
          from_date: this.from_date,
          to_date: this.to_date,
          search: this.search,
          user_id: this.user_id,
          is_user: true,
          type: parseInt(this.type_id)
        }
        console.log("104",dataTablesParameters);
        if(dataTablesParameters.user_id == undefined){
          delete dataTablesParameters.user_id
          delete dataTablesParameters.is_user
        }
        
        dataTablesParameters1.search.value != "" ? dataTablesParameters["search"] = (dataTablesParameters1.search.value) : ""
        // that.http.post<DataTablesResponse>('https://angular-datatables-demo-server.herokuapp.com/',dataTablesParameters, {})
        that.http.post<DataTablesResponse>(this.Base_Url + 'report/matchWiseP_L', dataTablesParameters, { headers: this.reqHeader })
        .subscribe(resp => {
            if(resp["status"]){
              this.matchPlList = resp.data;
              if(this.user_id == undefined){
                for (let i = 0; i < this.matchPlList.length; i++) {
                  this.matchPlList[i].downlineprofitloss = (this.matchPlList[i].total)
                  if(this.matchPlList[i].total >= 0){
                    this.matchPlList[i].profitloss = -(this.matchPlList[i].total + this.matchPlList[i].commission)
                  } else {
                    this.matchPlList[i].profitloss = -(this.matchPlList[i].total + this.matchPlList[i].commission)
                  }
                }
                this.profitloss = this.matchPlList.reduce(
                  (a: number, b) => a + b.profitloss, 0);
                this.downlineprofitloss = this.matchPlList.reduce(
                  (a: number, b) => a + b.downlineprofitloss, 0);
                this.commission = this.matchPlList.reduce(
                  (a: number, b) => a + b.commission, 0);
              } else{
                for (let i = 0; i < this.matchPlList.length; i++) {
                  this.matchPlList[i].sport_name = this.sport_name;
                  this.matchPlList[i].downlineprofitloss = (this.matchPlList[i].total)
                  if(this.matchPlList[i].total >= 0){
                    this.matchPlList[i].profitloss = (this.matchPlList[i].total + this.matchPlList[i].commission)
                  } else {
                    this.matchPlList[i].profitloss = (this.matchPlList[i].total + this.matchPlList[i].commission)
                  }
                }
              }
                callback({
                  recordsTotal:resp["metadata"][0].total,
                  recordsFiltered:resp["metadata"][0].total,
                  data: this.matchPlList
                });
                
            } else {
              this.toastr.error(resp["msg"]);
              this.matchPlList = []
              callback({
                recordsTotal: 0,
                recordsFiltered: 0,
                data: this.matchPlList
              });
            }

           
          });
      },
      columns: [
        {
          title: 'Event Name',
          data: 'match_name',
          "render": function (data, type, row) {
            var content = '';
              content = content + '<span style="color: #14805e !important;cursor: pointer;">' + row.match_name + '</span>';
            return content;
          }
        }, 
        { 
          title: 'Profit/Loss', 
          data: 'downlineprofitloss',
          "render": function (data, type, row) {
            var content = ''
            if (row.downlineprofitloss != null && row.downlineprofitloss < 0) {
              content = content + '<span class="text-center text-danger">' + (row.downlineprofitloss).toFixed(2) + '</span>';
            } else if (row.downlineprofitloss != null && row.downlineprofitloss >= 0) {
              content = content + '<span class="text-center text-success">' + (row.downlineprofitloss).toFixed(2) + '</span>';
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
          title: 'Total P&L',
          data: 'profitloss',
          "render": function (data, type, row) {
            var content = ''
            if (row.profitloss != null && row.profitloss < 0) {
              content = content + '<span class="text-center text-danger">' + (row.profitloss).toFixed(2) + '</span>';
            } else if (row.profitloss != null && row.profitloss >= 0) {
              content = content + '<span class="text-center text-success">' + (row.profitloss).toFixed(2) + '</span>';
            } else {
              content = '';
            }
            return content;
          }

        }],
      rowCallback :(row: Node, data: any[] | Object, index: number) => {
        const self = this;
        $('td', row).off('click');
        $('td', row).on('click',()=> {
          this.matchwisePl(data);
        });
        $( row ).addClass('text-center');
        return row; 
      }
    };
  }
  
  matchWisePl(){
    let data = {
      page: this.currentPage,
      limit: this.itemsPerPage,
      sport_id: this.sport_id,
      from_date : this.from_date,
      to_date : this.to_date,
      search : this.search,
      user_id: this.user_id,
      is_user: true,
      type : parseInt(this.type_id)
    }
    if(this.user_id == undefined){
      delete data.user_id;
      delete data.is_user;
    }
    if(data.type == undefined||data.type == null){
      delete data.type
    }
    if(data.search == ''||data.search == undefined||data.search == null){
      delete data.search;
    }
    this.report.matchpl(data).subscribe((res) => {
      if(res.status){
        this.matchPlList = res.data;
        if(res.data.metadata){
          this.total_items = res.metadata[0].total;
          this.currentPage = res.metadata[0].page
        }
        
        if(this.user_id == undefined){
          for (let i = 0; i < this.matchPlList.length; i++) {
            this.matchPlList[i].downlineprofitloss = (this.matchPlList[i].total)
            if(this.matchPlList[i].total >= 0){
              this.matchPlList[i].profitloss = -(this.matchPlList[i].total + this.matchPlList[i].commission)
            } else {
              this.matchPlList[i].profitloss = -(this.matchPlList[i].total + this.matchPlList[i].commission)
            }
          }
          this.profitloss = this.matchPlList.reduce(
            (a: number, b) => a + b.profitloss, 0);
          this.downlineprofitloss = this.matchPlList.reduce(
            (a: number, b) => a + b.downlineprofitloss, 0);
          this.commission = this.matchPlList.reduce(
            (a: number, b) => a + b.commission, 0);
        } else{
          for (let i = 0; i < this.matchPlList.length; i++) {
            this.matchPlList[i].sport_name = this.sport_name
          }
        }
        
      } else {
        this.toastr.error(res.msg);
        this.matchPlList = []
      }
    })
  }
  searchFilter(){
    this.search = this.searchMatch;
    this.matchWisePl();
  }
  setSelectedOption(selectedOption) {
    this.itemsPerPage = parseInt(selectedOption);
    this.currentPage = 1;
    this.matchWisePl();
  }
  matchwisePl(data){
    if(this.user_id == undefined){
      let a = this.Base_Url.split('api/v1/');
      // let b = 'http://192.168.0.8:4100/' + 'plMarketUserwise/' + data.match_id + '/'+ data.match_name + '/'+ this.type_id + '/'+ this.sport_id ;
      let b = a[0] + 'plMarketUserwise/' + data.match_id + '/'+ data.match_name + '/'+ this.type_id + '/'+ this.sport_id+ '/'+ this.from_date + '/'+ this.to_date;
      window.open(b, '_blank', 'location=yes,height=570,width=520,scrollbars=yes,status=yes');
    } else {
      let a = this.Base_Url.split('api/v1/');
      // let b = 'http://192.168.0.8:4100/' + 'plMarketUserwise/' + data.match_id + '/'+ data.match_name + '/'+ this.type_id + '/' + this.user_id + '/'+ this.sport_id;
      let b = a[0] + 'plMarketUserwise/' + data.match_id + '/'+ data.match_name + '/'+ this.type_id + '/' + this.user_id + '/'+ this.sport_id + '/'+ this.from_date + '/'+ this.to_date;
      window.open(b, '_blank', 'location=yes,height=570,width=520,scrollbars=yes,status=yes');
    }
    
  }
  pageChange(event?: any) {
    if (event) {
      this.currentPage = event
    }else{
      this.currentPage=1
    }
    this.matchWisePl();
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
