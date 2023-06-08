import { Component, OnInit, TemplateRef, ChangeDetectorRef, AfterViewInit, OnDestroy, ChangeDetectionStrategy, ElementRef, ViewChild, Output, EventEmitter } from '@angular/core';
import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { ReportService } from '../services/report.service';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from "@angular/router";
import { UsersService } from '../services/users.service';
import { CookieService } from 'ngx-cookie-service';
import * as moment from 'moment';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { environment } from '../../environments/environment';
class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
}
@Component({
  selector: 'app-password-history',
  templateUrl: './password-history.component.html',
  styleUrls: ['./password-history.component.scss']
})
export class PasswordHistoryComponent implements AfterViewInit, OnDestroy, OnInit {
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  moment: any = moment;
  public Base_Url = environment['adminServerUrl'];
  public token = localStorage.getItem('adminAccessToken');
  reqHeader = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ` + this.token
  });
  user_id: string;
  walletBalance: any;
  itemsPerPage: number = 10;
  currentPage: number = 1;
  total_items: number = 0;
  historyData: any;
  searchQuery: any;
  constructor(private http: HttpClient, private cdref: ChangeDetectorRef, private cookie: CookieService, private report: ReportService, private toastr: ToastrService, private router: Router, private route: ActivatedRoute, private usersService: UsersService,) { }

  ngOnInit(): void {
    // this.getUserBalance();
    // this.history();
    const that = this;
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 50,
      searching: true,
      paging: true,
      serverSide: true,
      processing: true,
      // lengthMenu : dataTableLengthMenu,
      ajax: (dataTablesParameters1: any, callback) => {
        let dataTablesParameters = {
          page: (dataTablesParameters1.start / dataTablesParameters1.length) + 1,
          limit: dataTablesParameters1.length,
        }
        console.log("104", dataTablesParameters);
        dataTablesParameters1.search.value != "" ? dataTablesParameters["search"] = (dataTablesParameters1.search.value) : ""
        // that.http.post<DataTablesResponse>('https://angular-datatables-demo-server.herokuapp.com/',dataTablesParameters, {})
        that.http.post<DataTablesResponse>(this.Base_Url + 'user/getPasswordChangedHistory', dataTablesParameters, { headers: this.reqHeader })
          .subscribe(resp => {
            if (resp["status"]) {
              if ((resp.data).length != 0) {
                this.historyData = resp.data;
                for (let i = 0; i < this.historyData.length; i++) {
                  this.historyData[i].updateDateTime = moment(this.historyData[i].createdAt).utcOffset("+5:30").format('DD-MM-YYYY HH:mm:ss');
                }
                callback({
                  recordsTotal: resp["metadata"].total,
                  recordsFiltered: resp["metadata"].total,
                  data: this.historyData
                });
              } else {
                this.historyData = []
                callback({
                  recordsTotal: 0,
                  recordsFiltered: 0,
                  data: this.historyData
                });
              }
            } else {
              this.toastr.error(resp["msg"]);
              this.historyData = []
              callback({
                recordsTotal: 0,
                recordsFiltered: 0,
                data: this.historyData
              });
            }


          });
      },
      columns: [
        {
          title: 'User Name',
          data: 'user_name'
        },
        {
          title: 'Remark',
          data: 'comment',
        },
        {
          title: 'Date & Time',
          data: 'updateDateTime',
        }],
      rowCallback: (row: Node, data: any[] | Object, index: number) => {
        const self = this;
        $(row).addClass('text-center');
        return row;
      }
    };
  }
  setSelectedOption(selectedOption) {
    this.itemsPerPage = parseInt(selectedOption);
    this.currentPage = 1;
    this.history();
  }

  history() {
    let data = {
      page: this.currentPage,
      limit: this.itemsPerPage,
      search: this.searchQuery
    }
    if (data.search == '') {
      delete data.search;
    }
    this.usersService.passwordHistory(data).subscribe((res) => {
      if (res.status) {
        this.historyData = res.data;
        this.total_items = res.metadata.total;
        this.currentPage = res.metadata.page
      }
    })
  }
  pageChange(event?: any) {
    if (event) {
      this.currentPage = event
    } else {
      this.currentPage = 1
    }
    this.history()
  }
  searchFilter() {
    this.history();
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
