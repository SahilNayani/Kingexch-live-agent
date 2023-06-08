import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { Location } from '@angular/common';
import { ReportService } from '../services/report.service';
import { UsersService } from '../services/users.service';
@Component({
  selector: 'app-banking',
  templateUrl: './banking.component.html',
  styleUrls: ['./banking.component.scss']
})
export class BankingComponent implements OnInit {
  itemsPerPage: number = 10;
  currentPage: number = 1;
  total_items: number = 0;
  usersListReqPageQuery: any;
  searchQuery: string;
  searchdomainId: any;
  searchlevelId: any;
  modalRef: BsModalRef;
  userList: any;
  loggedInUser: any;
  user_id: string;
  settleAmount: Array<any> = [];
  popUpData: boolean;
  settlementHistoryData: any;
  parentId: any;
  userId: any;
  crDr: any;
  remark: Array<any> = [];
  passWord: any;
  index: any;
  userChipsData: any;
  selectedUser: any;
  cRefrence: any;
  walletBalance: any;
  constructor(private usersService: UsersService, private locationBack: Location, public toastr: ToastrService, private report: ReportService, private modalService: BsModalService) { }

  ngOnInit(): void {
    this.loggedInUser = JSON.parse(localStorage.getItem('adminDetails'));
    this.user_id = localStorage.getItem('userId');
    this.getUserChildDetail(this.user_id);
    this.getWalletBallance();
  }

  getWalletBallance() {
    let data = {}
    this.usersService.getUserBalance(data).subscribe(response => {
      this.walletBalance = response.data;
    })
  }

  getUserChildDetail(id) {
    this.usersListReqPageQuery = {
      // user_id: id,
      page: this.currentPage,
      limit: this.itemsPerPage,
      user_name: this.searchQuery,
      // user_type_id: this.type,
      only_end_users: true
    };
    if (this.usersListReqPageQuery.user_name == undefined || this.usersListReqPageQuery.user_name == '') {
      delete this.usersListReqPageQuery.user_name
    }
    if (this.usersListReqPageQuery.user_id == undefined || this.usersListReqPageQuery.user_id == '') {
      delete this.usersListReqPageQuery.user_id
    }
    this.usersService.getChildList(this.usersListReqPageQuery).subscribe(data => {
      if (data.status == true) {
        this.userList = data.data;
        for (let i = 0; i < this.userList.length; i++) {
          this.userList[i].parent_id = data.parent_id;
        }
        this.total_items = data.metadata.total;
        //this.childLevelFilterValues = [];
        // if (this.childLevelFilterValues.length == 0) {
        //   for (let i = 0; i < this.adminDetails.highestNumberChild; i++) {
        //     this.childLevelFilterValues.push(i + 1)
        //   }
        // }

        // if (disableHierarchyadding) {
        //   this.hierarchy = []
        //   let checkforUsername = this.hierarchy.filter(
        //     hierarchy => hierarchy.userId == data.data._id);
        //   if (checkforUsername.length == 0) {
        //     this.hierarchy.push({ "page": this.currentPage, 'userId': data.data._id, 'user_name': data.data.user_name, 'user_type_id': data.data.user_type_id });
        //   } else {
        //     this.hierarchy.forEach((element, j) => {
        //       if (element.userId == checkforUsername[0].userId) {
        //         this.hierarchy[j].page = this.currentPage
        //       }
        //     });
        //   }
        //   if (this.previousRouteService.getPreviousUrl().includes('/addChild-agent/') || this.previousRouteService.getPreviousUrl().includes('/addChild-user/')
        //     || this.previousRouteService.getPreviousUrl().includes('/user-block-market/') || this.previousRouteService.getPreviousUrl().includes('/downline-report')) {
        //     let savedHierarchy = JSON.parse(sessionStorage.getItem("hierarchy"))
        //     this.hierarchy = savedHierarchy
        //     this.onUserNameClicked(savedHierarchy[savedHierarchy.length - 1].userId, savedHierarchy[savedHierarchy.length - 1].user_type_id, "onclickusername", savedHierarchy[savedHierarchy.length - 1].page)
        //     this.hierarchy.splice(-1, 1);
        //   }
        // }

        // this.userList.forEach(element => {
        //   this.displayPermissionBox.push(false)
        //   this.mobileDisplayPermissionBox.push(false)
        //   this.displayPasswordBox.push(false)
        // });
      }

    }, error => {
      console.log(error)
    })
  }
  setSelectedPageOption(selectedOption) {
    this.itemsPerPage = parseInt(selectedOption);
    this.getUserChildDetail(this.user_id)
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
  deposit(data, id, parentData, i) {
    this.userId = id;
    this.parentId = parentData
    this.crDr = data;
    this.index = i
  }

  pageChange(newPage: number) {
    this.currentPage = newPage;
    this.usersListReqPageQuery = {
      page: this.currentPage,
      limit: this.itemsPerPage,
      searchQuery: this.searchQuery
    };
    // if (this.levelParentUserId != null && this.levelParentUserId != undefined) {
    //   this.getSubUserChild(this.levelParentUserId, null);
    // }
    // else {
    this.getUserChildDetail(this.user_id);
    // }
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
    this.getUserChildDetail(this.user_id);
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
    this.getUserChildDetail(this.user_id);
    // }
  }
  depositWithdrawl() {
    debugger
    if (this.settleAmount[this.index]) {
      if (this.passWord == undefined || this.passWord == null || this.passWord == '') {
        this.toastr.error("please enter password", '', {
          timeOut: 10000,
        });
      } else {
        if (this.remark[this.index]) {
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
                this.getUserChildDetail(this.user_id);
              } else {
                this.toastr.error(data.msg, '', {
                  timeOut: 10000,
                });
              }
            }, error => {
              console.log(error)
            })
          } else {
            this.toastr.error("Please select Deposit/Withdrawl.", '', {
              timeOut: 5000,
            });
          }
          
        } else {
          this.toastr.error("Please enter remark", '', {
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
  clear() {
    this.userId = '';
    this.parentId = '';
    this.crDr = '';
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
        this.getUserChildDetail(this.user_id);
      }
    })
  }
}
