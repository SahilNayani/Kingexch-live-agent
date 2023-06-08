import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { Location } from '@angular/common';
import { ReportService } from '../services/report.service';
import { UsersService } from '../services/users.service';
@Component({
  selector: 'app-master-banking',
  templateUrl: './master-banking.component.html',
  styleUrls: ['./master-banking.component.scss']
})
export class MasterBankingComponent implements OnInit {
  itemsPerPage: number = 10;
  currentPage: number = 1;
  total_items: number = 0;
  usersListReqPageQuery: any;
  searchQuery: string;
  searchdomainId: any;
  searchlevelId: any ;
  modalRef: BsModalRef;
  userList: any;
  loggedInUser: any;
  user_id: string;
  settleAmount: Array<any> = [];
  type: number;
  adminDetails: any;
  paidtoData: any;
  recedData: any;
  popUpData: boolean;
  settlementHistoryData: any;
  userChipsData: any;
  settlementAmount: any;
  parentId: any;
  userId: any;
  crDr: any;
  remark:Array<any> = [];
  passWord:any;
  index: any;
  selectedUser: any;
  cRefrence: any;
  walletBalance: any;
  constructor(private usersService: UsersService,private locationBack: Location,public toastr: ToastrService, private report: ReportService, private modalService: BsModalService) { }

  ngOnInit(): void {
    this.loggedInUser = JSON.parse(localStorage.getItem('adminDetails'))
    this.user_id = localStorage.getItem('userId');
    this.type = (this.loggedInUser.user_type_id ) - 1;
    this.getUserChildDetail(this.user_id, false);
    this.getWalletBallance();
  }

  getWalletBallance() {
    this.usersService.getUserBalance(this.user_id).subscribe(response => {
      this.walletBalance = response.data;
    })
  }

  openModalExposureLimit(exposureLimit: TemplateRef<any>) {
    this.modalRef = this.modalService.show(
      exposureLimit,
      Object.assign({}, { class: 'exposureLimit-modal modal-lg' })
    );
  }
  openModalHistory(userId, history: TemplateRef<any>) {
    this.modalRef = this.modalService.show(
      history,
      Object.assign({}, { class: 'history-modal modal-lg' })
    );
    let data = {
      user_id: userId
    }
    this.report.settleHistory(data).subscribe((res) => {
      if (res.status == true) {
        this.popUpData = true;
        this.settlementHistoryData = res.data;
      } else {
        this.popUpData = false;
        this.toastr.error(res.msg, '', {
          timeOut: 10000,
        })
      }
    })
  }
  getUserChildDetail(id, disableHierarchyadding?: boolean) {
    this.usersListReqPageQuery = {
      user_id: id,
      page: this.currentPage,
      limit: this.itemsPerPage,
      user_name: this.searchQuery,
      // user_type_id: this.type,
      only_end_users : this.type == 1 ? true : false
    };
    if(this.usersListReqPageQuery.user_id == undefined){
      delete this.usersListReqPageQuery.user_id
    }
    if(this.usersListReqPageQuery.user_name == undefined || this.usersListReqPageQuery.user_name == ''){
      delete this.usersListReqPageQuery.user_name
    }
    if(this.usersListReqPageQuery.only_end_users == false){
      delete this.usersListReqPageQuery.only_end_users
    }
    if (this.searchlevelId != 0) {
      this.usersListReqPageQuery["levelId"] = this.searchlevelId
    } else {
      delete this.usersListReqPageQuery.searchlevelId
    }
    if (this.searchQuery != '') {
      delete this.usersListReqPageQuery.user_type_id
      this.currentPage = 1
    }
    if (this.usersListReqPageQuery.searchQuery == '') {
      delete this.usersListReqPageQuery.searchQuery
      delete this.usersListReqPageQuery.user_type_id
    }
    if (this.searchdomainId) {
      this.usersListReqPageQuery["domainId"] = this.searchdomainId
    } else {
      delete this.usersListReqPageQuery.domainId
    }
      this.usersService.getChildList(this.usersListReqPageQuery).subscribe(data => {
        if (data.status == true) {
          this.userList = data.data;
          // let a3 = this.userList.map(t1 => ({ ...t1, ...this.paidtoData.find(t2 => (t2.user_id === t1._id)) }));
          // this.userList = a3.filter(t => t.settlement_amount != undefined);
          this.total_items = data.metadata.total;
        }

      }, error => {
        console.log(error)
      })
   
  }
  settlement(amount,user, i) {
    this.settleAmount[i] = amount
    this.index = i
    this.userId = user.user_id;
    this.parentId = user.parent_id
  }
  indexValue(i){
    this.index = i
  }
  deposit(data,id,parentData,i){
    this.userId = id;
    this.parentId = parentData
    this.crDr = data;
    this.index = i
  }
  setSelectedOption(selectedOption) {
    this.itemsPerPage = parseInt(selectedOption);
    this.usersListReqPageQuery = {
      page: this.currentPage,
      limit: this.itemsPerPage,
      searchQuery: this.searchQuery
    };
    // if (this.levelParentUserId != null && this.levelParentUserId != undefined) {
    //   this.getSubUserChild(this.levelParentUserId, null);
    // }
    // else {
      this.getUserChildDetail(this.user_id, false);
    // }
  }
  searchFilter() {
    this.usersListReqPageQuery = {
      page: this.currentPage,
      limit: this.itemsPerPage,
      searchQuery: this.searchQuery,
      domainId: this.searchdomainId,
      levelId: this.searchlevelId
    };
    // if (this.levelParentUserId != null && this.levelParentUserId != undefined) {
    //   this.getUserChildDetail(this.levelParentUserId, false);
    // }
    // else {
      this.getUserChildDetail(this.user_id, false);
    // }
  }
  userSettlement(userId) {
    this.adminDetails = JSON.parse(localStorage.getItem('adminDetails'));
    
      let data;
      if (userId == '' || userId == null) {
        data = {

        };
      } else {
        data = {
          "user_id": userId
        }
      }
      this.report.settlement(data).subscribe((res) => {
        if (res.status) {
          this.paidtoData = res.data.data_paid_to.list;
          this.recedData = res.data.data_receiving_from.list;
          this.paidtoData = this.paidtoData.map(v => ({...v , type : 1}))
          this.recedData = this.recedData.map(v => ({...v , type : 2}))
          Array.prototype.push.apply(this.paidtoData,this.recedData); 
          this.paidtoData = this.paidtoData.filter(t => t.user_type_id == (this.adminDetails.user_type_id-1))
          this.getUserChildDetail(this.user_id, true);
        } else {
          this.toastr.error(res.msg, '', {
            timeOut: 10000,
          })
        }
      })

  }
  pageChange(newPage: number) {
    // if (this.levelParentUserId != null && this.levelParentUserId != undefined) {
    //   this.getSubUserChild(this.levelParentUserId, null);
    // }
    // else {
      this.getUserChildDetail(this.user_id, false);
    // }
    this.currentPage = newPage;
    this.usersListReqPageQuery = {
      page: this.currentPage,
      limit: this.itemsPerPage,
      searchQuery: this.searchQuery
    };
  }
  depositWithdrawl() {
    if (this.settleAmount[this.index]) {
      if (this.passWord == undefined || this.passWord == null || this.passWord == '') {
        this.toastr.error("please enter password", '', {
          timeOut: 10000,
        });
      } else {
        if (this.remark[this.index]  ) {
          if(this.crDr != undefined){
            this.userChipsData = {
              "user_id": this.userId,
              "parent_id": this.parentId,
              "crdr": this.crDr,
              "amount": this.settleAmount[this.index],
              "remark": this.remark[this.index],
              // "logged_in_user_id": this.user_id,
              "password": this.passWord
            }
            this.usersService.depositWithdrawl(this.userChipsData).subscribe(data => {
              if (data.status == true) {
                this.toastr.success(data.msg, '', {
                  positionClass: 'toast-bottom-right',
                  timeOut: 1000
                });
                this.clear();
                this.getUserChildDetail(this.user_id, false);
              } else {
                this.toastr.error(data.msg, '', {
                  timeOut: 10000,
                });
              }
            }, error => {
              console.log(error)
            })
          } else{
            this.toastr.error("Please select Deposit/Withdrawl.", '', {
              timeOut: 5000,
            });
          }
        } else {
          this.toastr.error("please enter remark", '', {
            timeOut: 5000,
          });
        }

      }
    } else {
      this.toastr.error("please enter Amount", '', {
        timeOut: 10000,
      });
    }
  }
  clear(){
    this.userId='';
    this.parentId='';
    this.crDr= '';
    this.settleAmount = [];
    this.remark = [];
    this.passWord = ''
  }
  openModalCreditRefModal(creditRefModal: TemplateRef<any>, user) {
    this.selectedUser = user;
    this.modalRef = this.modalService.show(
      creditRefModal,
      Object.assign({}, { class: 'creditRefModal-modal' })
    );
  }
  updateCRefrence() {
    let data = {
      "user_id": this.selectedUser._id,
      "new_credit_reference": this.cRefrence
    }
    this.usersService.updateCR(data).subscribe((res) => {
      if (res.status == true) {
        this.toastr.success(res.msg);
        this.modalRef.hide();
        this.getUserChildDetail(this.user_id, false);
      }
    })
  }
}
