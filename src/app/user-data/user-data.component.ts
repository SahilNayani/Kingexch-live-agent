import { Component, OnInit, TemplateRef, ChangeDetectorRef,ChangeDetectionStrategy,ElementRef, ViewChild, Output, EventEmitter } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { UsersService } from '../services/users.service';
import { CookieService } from 'ngx-cookie-service';
import { FormArray, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { SportService } from '../services/sport.service';
import Swal from 'sweetalert2'
import { json } from 'express';
import { ReportService } from '../services/report.service';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from "@angular/router";
import { LoginService } from '../services/login.service';
import { SocketServiceService } from '../services/socket-service.service';
import { environment } from '../../environments/environment';
import { AppValidationService } from '../app-validation/app-validation.service';
//import { io, Socket } from 'socket.io-client';
import { ExcelServiceService } from '../services/excel-service.service';
import { WebsiteSettingService } from '../services/website-setting.service'
declare var $: any;
import jspdf from 'jspdf';
import html2canvas from 'html2canvas';
import { PreviousRouteService } from '../services/previous-route.service';
import { ValidatorControls } from '../app-validation/validation-controls.directive';
import { JsonpClientBackend } from '@angular/common/http';
import { ClipboardService } from 'ngx-clipboard';
@Component({
  selector: 'app-user-data',
  templateUrl: './user-data.component.html',
  styleUrls: ['./user-data.component.scss'],
  providers: [ExcelServiceService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserDataComponent implements OnInit {
  public Base_Url = environment['adminServerUrl'];
  @Output() notify = new EventEmitter<any>();
  modalRef: BsModalRef;
  changePasswordForm: FormGroup;
  addUserFrom: FormGroup;
  isAddUserFromSubmitted = false;
  userList = [];
  user_id: any;
  submitted = false;
  selectedUserId;
  levelParentUserId: string = null;
  adminDetails;
  itemsPerPage: number = 10;
  currentPage: number = 1;
  total_items: number = 0;
  usersListReqPageQuery: any;
  searchQuery: string;
  userParentData: any;
  userChipsData: any;
  userDetail: any;
  path: string;
  data: any;
  password: any;
  depositWithdrawlForm: FormGroup;
  isUpdateShareValid: boolean = true;
  selectedUserPartnershipList = [];
  tempUserShareSportList = [];
  updatePartnershipPassword;
  displayPermissionBox: Array<boolean> = []
  mobileDisplayPermissionBox: Array<boolean> = []
  displayPasswordBox: Array<boolean> = []
  childLevelFilterValues: Array<number> = []
  showSelectedUserName;
  socket: any;
  searchdomainId: any;
  searchlevelId: any;
  hierarchy: Array<{ "page": number, "userId": string, "user_name": string, 'user_type_id': string }> = [];
  websiteList: any = [];
  searchedwebsiteList: any
  sportsForm: FormGroup;
  userSportSettingDetails = [];
  specificUserDetails = []
  hiddenpass: Array<boolean> = [];
  parentLevelIds = [];
  levels = []
  userPermissionsList = [];
  permissions = []
  previousUrl: string = "";
  currentUrl: string = "";
  isSocket;
  fromIndexCon;
  transactionPassword: any;
  rawPassword: any;
  rawPasswordIndex: any;
  isApiSocket: boolean = false;
  public showPassword: boolean;
  loggedInUser: any;
  addedSportShareList = [];
  sportErrorData: any
  addedSportShareDetails = {
    parent_share: 0,
    user_share: 0,
    // share: 0,
    user_type_id: 0
  };
  selectedIndex: number = 0;
  resetPasswordForm: FormGroup;
  specificUserParentDetails: any;
  sportSettingParentValidation: boolean = true;
  assendingCL: boolean = true;
  assendingUsername: boolean = true;
  assendingbalance: boolean = true;
  assendingpoint: boolean = true;
  walletBalance: any
  exposureData: any;
  expoLength: any;
  expo_User_name: any;
  marketCommission: any;
  sessionCommission: any;
  UserCommissinSettings: any;
  userParentName: any;
  parentList: any;
  addUserId: string;
  addUserTypeId: any;
  status: boolean = false;
  objectId: any;
  displayTooltip: boolean;
  contenCopied: any;
  expoTotal: any;
  plTotal: any;
  balTotal: any;
  selectedUser: any;
  params: any;
  loggedInUserTypeId: any;
  userSportPartnerShip: any;
  isUserNameExist: boolean;
  updateExposureLimit: any;
  cRefrence: any;
  paidtoData: any;
  plusData: any;
  minusData: any;
  historyCrData: any;
  searchParam: any;
  itemsPP: number = 10;
  currentPageNo: number = 1;
  totalItems: number = 0;
  selectedStatus: number = 0;
  constructor(private modalService: BsModalService, private sport: SportService,
    private previousRouteService: PreviousRouteService, public clipboardService: ClipboardService,
    private websiteSettingService: WebsiteSettingService, private report: ReportService,private cdref: ChangeDetectorRef,
    private fb: FormBuilder, private toastr: ToastrService, private router: Router, private route: ActivatedRoute,
    private loginService: LoginService, private usersService: UsersService, private cookie: CookieService, private locationBack: Location,
    private appValidationService: AppValidationService, private socketService: SocketServiceService, public excelService: ExcelServiceService) {
    //this.socket = io('http://localhost:3002');
  }

  async ngOnInit() {
    this.loggedInUser = JSON.parse(localStorage.getItem('adminDetails'))
    this.user_id = localStorage.getItem('userId');
    this.addUserId = localStorage.getItem('userId');
    this.addUserTypeId = this.loggedInUser.user_type_id;
    this.sportsForm = this.fb.group({
      sports_settings: this.fb.array([])
    })
    // await this.socketService.setUpSocketConnection();
    this.isSocket = this.cookie.get('is_socket');
    this.isSocket = 0;
    this.getAllwebsite();
    this.getUserBalance();
    this.depositWithdrawlForm = this.fb.group({
      "accChips": 0,
      "reMark": '',
      "userPass": ''
    });
    this.applyValidationToFormGroup(this.depositWithdrawlForm, "UserDataDepositWithdrawl")
    this.getUserChildDetail(this.user_id, true)
    // this.userSettlement('');
    // this.socketService.socket.on('userDataInit', (data) => {
    // })


    // this.socketEmit();
    // this.socketListenersUser();

    this.resetPasswordForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(6)]]
    })

  }

  // socketOnEvent(eventName, callback) {
  //   this.socketService.socket.on(eventName, data => callback(data));
  // }

  // socketEmitEvent(eventName, data) {
  //   this.socketService.socket.emit(eventName, data);
  // }

  // socketListenersUser() {

  //   this.socketOnEvent(`getUserDetails`, data => {
  //     if (data.status == true) {
  //       this.userDetail = data.data;
  //     } else {
  //       this.toastr.error(data.msg,'',{
  //         timeOut: 10000,
  //       });
  //     }
  //   });

  //   this.socketOnEvent(`chipInOut`, data => {
  //     if (data.status == true) {
  //       this.toastr.success(data.msg,'',{
  //         positionClass: 'toast-bottom-right',
  //         timeOut:1000
  //        });
  //       this.modalRef.hide();
  //       this.getUserChildDetail(data.data.parent_id,true)
  //       this.usersService.updatechangeBalance();
  //       this.socketEmitEvent('userData', data.data.user_id);
  //     } else {
  //       this.toastr.error(data.msg,'',{
  //         timeOut: 10000,
  //       });
  //     }
  //   });

  //   this.socketOnEvent(`getUserDetailsWithChildLevelDetails`, data => {
  //     if (this.levelParentUserId != null && this.levelParentUserId != undefined) {
  //       if (this.fromIndexCon != "onclickusername" && this.fromIndexCon != null) {
  //         let length = this.hierarchy.length
  //         this.hierarchy.splice(this.fromIndexCon, length - this.fromIndexCon);
  //       } else if (this.fromIndexCon != null) {
  //         this.hierarchy.push({ "page": this.currentPage, 'userId': data.data._id, 'user_name': data.data.user_name });
  //       }
  //       this.userList = data.data.childLevelDetails;
  //     }
  //     else {
  //       this.userList = data.data.childLevelDetails;
  //       this.adminDetails = data.data;
  //       this.total_items = data.total;
  //       this.childLevelFilterValues = [];
  //       for (let i = 0; i < this.adminDetails.highestNumberChild; i++) {
  //         this.childLevelFilterValues.push(i + 1)
  //       }
  //       this.hierarchy = []
  //       this.hierarchy.push({ "page": this.currentPage, 'userId': data.data._id, 'user_name': data.data.user_name });
  //       if (this.previousRouteService.getPreviousUrl().includes('/addChild-agent/') || this.previousRouteService.getPreviousUrl().includes('/addChild-user/')
  //         || this.previousRouteService.getPreviousUrl().includes('/user-block-market/') || this.previousRouteService.getPreviousUrl().includes('/downline-report')) {
  //         let savedHierarchy = JSON.parse(sessionStorage.getItem("hierarchy"))
  //         // savedHierarchy.forEach((element, index) => {
  //         //   if (index != 0) {
  //         this.hierarchy = savedHierarchy
  //         this.onUserNameClicked(savedHierarchy[savedHierarchy.length - 1].userId, "onclickusername", savedHierarchy[savedHierarchy.length - 1].page)
  //         this.hierarchy = this.hierarchy.splice(-1, 1);
  //         //   }
  //         // });
  //       }
  //       this.userList.forEach(element => {
  //         this.displayPermissionBox.push(false)
  //         this.displayPasswordBox.push(false)
  //       });
  //     }
  //   });

  //   this.socketOnEvent(`updateChildPassword`, data => {
  //     if (data.status == true) {
  //       this.userParentData = data.data;
  //       this.getUserChildDetail(data.parentId,false);
  //       this.toastr.success(data.msg,'',{
  //         positionClass: 'toast-bottom-right',
  //         timeOut:1000
  //        });
  //       this.modalRef.hide();
  //     } else {
  //       this.toastr.error(data.msg,'',{
  //         timeOut: 10000,
  //       });
  //     }
  //   });

  //   this.socketOnEvent(`lockAndUnlockAccountOfUser`, data => {
  //     if (data.status == true) {
  //       if (this.levelParentUserId != null && this.levelParentUserId != undefined) {
  //         this.getSubUserChild(this.levelParentUserId, null);
  //       }
  //       else {
  //         this.getUserChildDetail(this.user_id,false);
  //       }
  //       this.toastr.success(data.msg,'',{
  //         positionClass: 'toast-bottom-right',
  //         timeOut:1000
  //        });
  //     } else {
  //       this.toastr.error(data.msg,'',{
  //         timeOut: 10000,
  //       });
  //     }
  //   });

  //   this.socketOnEvent(`closeAndReOpenAccountOfUserAndTheirChilds`, data => {
  //     if (data.status == true) {
  //       if (this.levelParentUserId != null && this.levelParentUserId != undefined) {
  //         this.getSubUserChild(this.levelParentUserId, null);
  //       }
  //       else {
  //         this.getUserChildDetail(this.user_id,false);
  //       }
  //       this.toastr.success(data.msg,'',{
  //         positionClass: 'toast-bottom-right',
  //         timeOut:1000
  //        });
  //     } else {
  //       this.toastr.error(data.msg,'',{
  //         timeOut: 10000,
  //       });
  //     }
  //   });

  //   this.socketOnEvent(`getPartnershipListByUserId`, data => {
  //     if (data.status == true) {
  //       this.selectedUserPartnershipList = data.data.sports_share;
  //       this.checkUserSportShareForDisplay();
  //     } else {
  //       this.toastr.error(data.msg,'',{
  //         timeOut: 10000,
  //       });
  //     }
  //   });

  //   this.socketOnEvent(`updatePartnershipList`, data => {
  //     if (data.status == true) {
  //       this.toastr.success(data.msg,'',{
  //         positionClass: 'toast-bottom-right',
  //         timeOut:1000
  //        });
  //       if (this.levelParentUserId != null && this.levelParentUserId != undefined) {
  //         this.getSubUserChild(this.levelParentUserId, null);
  //       }
  //       else {
  //         this.getUserChildDetail(this.user_id,false);
  //       }
  //       this.modalService.hide();
  //     } else {
  //       this.toastr.error(data.msg,'',{
  //         timeOut: 10000,
  //       });
  //     }
  //   });

  //   this.socketOnEvent(`updateUserStatusBettingLockUnlock`, data => {
  //     if (data.status == true) {
  //       this.toastr.success(data.msg,'',{
  //         positionClass: 'toast-bottom-right',
  //         timeOut:1000
  //        });
  //       if (this.levelParentUserId != null && this.levelParentUserId != undefined) {
  //         this.getSubUserChild(this.levelParentUserId, null);
  //       }
  //       else {
  //         this.getUserChildDetail(this.user_id,false);
  //       }
  //     } else {
  //       this.toastr.error(data.msg,'',{
  //         timeOut: 10000,
  //       });
  //     }
  //   });

  //   this.socketOnEvent(`updateUserStatusFancyBetLock`, data => {
  //     if (data.status == true) {
  //       this.toastr.success(data.msg,'',{
  //         positionClass: 'toast-bottom-right',
  //         timeOut:1000
  //        });
  //       if (this.levelParentUserId != null && this.levelParentUserId != undefined) {
  //         this.getSubUserChild(this.levelParentUserId, null);
  //       }
  //       else {
  //         this.getUserChildDetail(this.user_id,false);
  //       }
  //     } else {
  //       this.toastr.error(data.msg,'',{
  //         timeOut: 10000,
  //       });
  //     }
  //   });

  //   this.socketOnEvent(`updateUserStatusFancyBetUnlock`, data => {
  //     if (data.status == true) {
  //       this.toastr.success(data.msg,'',{
  //         positionClass: 'toast-bottom-right',
  //         timeOut:1000
  //        });
  //       if (this.levelParentUserId != null && this.levelParentUserId != undefined) {
  //         this.getSubUserChild(this.levelParentUserId, null);
  //       }
  //       else {
  //         this.getUserChildDetail(this.user_id,false);
  //       }
  //     } else {
  //       this.toastr.error(data.msg,'',{
  //         timeOut: 10000,
  //       });
  //     }
  //   });

  //   this.socketOnEvent(`getWebsiteList`, data => {
  //     if (data.status == true) {
  //       this.searchedwebsiteList = data.data
  //     } else {
  //       this.toastr.error(data.msg,'',{
  //         timeOut: 10000,
  //       });
  //     }
  //   });

  //   this.socketOnEvent(`getUserSportsWiseSettingDetails`, data => {
  //     if (data.status == true) {
  //       this.specificUserDetails = data.data;
  //       this.createSportsSettingArray()
  //     } else {
  //       this.toastr.error(data.msg,'',{
  //         timeOut: 10000,
  //       });
  //     }
  //   });

  //   this.socketOnEvent(`updateSportWiseSettingDetails`, data => {
  //     if (data.status == true) {
  //       this.toastr.success(data.msg,'',{
  //         positionClass: 'toast-bottom-right',
  //         timeOut:1000
  //        });
  //       this.modalService.hide()
  //     } else {
  //       this.toastr.error(data.msg,'',{
  //         timeOut: 10000,
  //       });
  //     }
  //   });
  // }

  // socketEmit() {
  //   this.socketEmitEvent('get-all-sports-list', '');
  // }

  goToBack() {
    this.locationBack.back();
  }

  addUser(userid, typeid) {
    sessionStorage.setItem("hierarchy", JSON.stringify(this.hierarchy))
    this.router.navigate(['addChild-user/' + userid + '/' + typeid])
  }

  downlineList(user) {
    sessionStorage.setItem("hierarchy", JSON.stringify(this.hierarchy))
    this.router.navigate(['downline-report/' + user._id + '/' + user.user_type_id], { queryParams: { netExposure: JSON.stringify(user.exposure), balance: JSON.stringify(user.balance), profit_loss: JSON.stringify(user.profit_loss) } })
  }

  userPermissionSetting(index) {
    if (!this.displayPermissionBox[index]) {
      this.displayPermissionBox.forEach((element, index) => {
        this.displayPermissionBox[index] = false
      });
    }
    this.displayPermissionBox[index] = !this.displayPermissionBox[index];
    // setTimeout(() => {
    //   this.closeUserPermissionDiv(index)
    // }, 15000);

  }


  userMobilePermissionSetting(index) {
    if (!this.mobileDisplayPermissionBox[index]) {
      this.mobileDisplayPermissionBox.forEach((element, index) => {
        this.mobileDisplayPermissionBox[index] = false
      });
    }
    this.mobileDisplayPermissionBox[index] = !this.mobileDisplayPermissionBox[index];
    setTimeout(() => {
      this.closeUserPermissionDiv(index)
    }, 15000);
  }

  closeMobilsUserPermissionDiv(index) {
    this.mobileDisplayPermissionBox[index] = false;
  }

  closeUserPermissionDiv(index) {
    this.displayPermissionBox[index] = false;
  }

  closeUserPasswordDiv(index) {
    this.displayPasswordBox[index] = false;
  }

  openModalDeposit(deposite: TemplateRef<any>) {
    this.depositWithdrawlForm.reset()
    this.modalRef = this.modalService.show(
      deposite,
      Object.assign({}, { class: 'deposite-modal exposure-limit' })
    );
  }
 
  openModalAddClient(addClient: TemplateRef<any>) {
    this.addedSportShareList = [];
    this.modalRef = this.modalService.show(
      addClient,
      Object.assign({}, { class: 'add-user' })
    );
    this.getLoginUseretails();
    this.createUserForm();
  }

  openModalSportSetting(sportSetting: TemplateRef<any>, user) {
    this.sportErrorData = undefined
    this.sportSettingParentValidation = user.check_event_limit
    this.showSelectedUserName = user.user_name;
    this.selectedUserId = user._id;
    this.getUserSportsWiseSettingDetails(user._id, user.userSettingSportsWise, user)
    this.modalRef = this.modalService.show(
      sportSetting,
      Object.assign({}, { class: 'sportSetting-modal modal-lg' })
    );
  }

  openModalWithdraw(withdraw: TemplateRef<any>) {
    this.depositWithdrawlForm.reset()
    this.modalRef = this.modalService.show(
      withdraw,
      Object.assign({}, { class: 'withdraw-modal modal-lg' })
    );
  }

  openModalSharing(sharing: TemplateRef<any>) {
    this.modalRef = this.modalService.show(
      sharing,
      Object.assign({}, { class: 'sharing-modal modal-lg' })
    );
  }

  openModalComissionSetting(comissionSetting: TemplateRef<any>, user) {
    this.getUserCommission(user._id)
    this.modalRef = this.modalService.show(
      comissionSetting,
      Object.assign({}, { class: 'comissionSetting-modal modal-lg' })
    );
  }

  openModalPermissionSetting(permissionSetting: TemplateRef<any>) {
    this.modalRef = this.modalService.show(
      permissionSetting,
      Object.assign({}, { class: 'permissionSetting-modal modal-lg' })
    );
  }

  openModalResetPwd(resetPwd: TemplateRef<any>, userid) {
    this.selectedUserId = userid;
    this.modalRef = this.modalService.show(
      resetPwd,
      Object.assign({}, { class: 'resetPwd-modal modal-lg' })
    );
  }

  async openModalRawPwd(rawPwd: TemplateRef<any>, userid, index) {
    this.selectedUserId = userid;
    this.rawPasswordIndex = index;
    if (!this.cookie.get('transaction-password')) {
      this.modalRef = this.modalService.show(
        rawPwd,
        Object.assign({}, { class: 'rawPwd-modal modal-lg' })
      );
    }
    else {
      this.transactionPassword = await this.usersService.decryptData(this.cookie.get('transaction-password'))
      this.getUserRawPassword();
    }
  }

  openModalUserPwd(userPwd: TemplateRef<any>, userid) {
    this.selectedUserId = userid;
    this.modalRef = this.modalService.show(
      userPwd,
      Object.assign({}, { class: 'userPwd-modal' })
    );
  }
  openModalDeleteList(deleteList: TemplateRef<any>, user) {
    this.selectedUserId = user._id;
    this.selectedUser = user;
    this.modalRef = this.modalService.show(
      deleteList,
      Object.assign({}, {  })
    );
  }
  openModalChangeStatus(masterStatus: TemplateRef<any>, user) {
    this.selectedUserId = user._id;
    this.selectedUser = user;
    this.selectedStatus = 0;
    this.modalRef = this.modalService.show(
      masterStatus,
      Object.assign({}, { class: 'userPwd-modal' })
    );
  }
  openModalCreditRefModal(creditRefModal: TemplateRef<any>, user) {
    this.selectedUser = user;
    this.modalRef = this.modalService.show(
      creditRefModal,
      Object.assign({}, { class: 'creditRefModal-modal' })
    );
  }
  openModalExposureLimit(exposureLimit: TemplateRef<any>, user) {
    this.selectedUser = user;
    this.modalRef = this.modalService.show(
      exposureLimit,
      Object.assign({}, { class: 'exposureLimit-modal' })
    );
  }
  openModalCR(creditReference: TemplateRef<any>, user) {
    this.selectedUser = user;
    this.modalRef = this.modalService.show(
      creditReference,
      Object.assign({}, { class: 'exposureLimit-modal modal-lg' })
    );
  }
  updateExpoLimit() {
    let data = {
      "filter": {
        "user_id": this.selectedUser._id
      },
      "update": {
        "exposure_limit": this.updateExposureLimit
      }
    }
    this.usersService.updateCreditReference(data).subscribe((res) => {
      if (res.status == true) {
        this.toastr.success(res.msg);
        this.modalRef.hide();
        this.getUserChildDetail(this.user_id, true)
      }
    })
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
        this.getUserChildDetail(this.user_id, true)
      }
    })
  }
  historyCRefrence() {
    let data = {
      "user_id": this.selectedUser._id,
      "search" : this.searchParam,
      // "page": this.currentPageNo,
      // "limit": this.itemsPP,
    }
    if(data.search == undefined || data.search == ''){
      delete data.search
    }
    this.usersService.historyCreditReference(data).subscribe((res) => {
      if (res.status == true) {
        this.historyCrData = res.data;
        // this.totalItems = res.total;
      }
    })
  }
  setSelectedPageOption(selectedOption) {
    this.itemsPerPage = parseInt(selectedOption);
    this.getUserChildDetail(this.user_id, true)
  }
  popupPageChange(newPage: number) {
    this.currentPage = newPage;
    this.historyCRefrence();
  }
  redirectToStatement(userid) {
    sessionStorage.setItem("hierarchy", JSON.stringify(this.hierarchy))
    this.router.navigate(['child-statement/' + userid])
  }

  getUserAndParentDetails(id) {
    this.usersService.getUserDetailsWithParentDetails(id).subscribe(data => {
      if (data.status == true) {
        this.userParentData = data.data;
      } else {
        this.toastr.error(data.msg, '', {
          timeOut: 10000,
        });
      }
    }, error => {
      console.log(error)
    })
  }

  openActionList(user) {
    if (user.status == undefined) {
      user.status = !this.status;
    } else {
      user.status = !user.status;
    }
  }

  depositWithdrawl(id, parentId, crdr) {
    if (this.depositWithdrawlForm.controls.accChips.value) {
      if (this.depositWithdrawlForm.controls.userPass.value) {
        if(this.depositWithdrawlForm.controls.reMark.value != null){
          this.userChipsData = {
            "user_id": id,
            "parent_id": parentId,
            "crdr": crdr,
            "amount": this.depositWithdrawlForm.controls.accChips.value,
            "remark": this.depositWithdrawlForm.controls.reMark.value,
            // "logged_in_user_id": this.user_id,
            "password": this.depositWithdrawlForm.controls.userPass.value
          }
            this.usersService.depositWithdrawl(this.userChipsData).subscribe(data => {
              if (data.status == true) {
                this.toastr.success(data.msg, '', {
                  positionClass: 'toast-bottom-right',
                  timeOut: 1000
                });
                this.modalRef.hide();
                this.getUserChildDetail(parentId, false)
                this.getUserBalance();
                this.usersService.updatechangeBalance();
                // this.socketEmitEvent('userData', id);
              } else {
                this.toastr.error(data.msg, '', {
                  timeOut: 10000,
                });
              }
            }, error => {
              console.log(error)
            })
        } else {
          this.toastr.error("please enter remark", '', {
            timeOut: 5000,
          });
        }
        
              } else {
        this.toastr.error("please enter password", '', {
          timeOut: 5000,
        });
      }
    } else {
      this.toastr.error("please enter Amount", '', {
        timeOut: 5000,
      });
    }
  }

  redirectToAddChild(userid, typeid, user) {
    if (typeid != 2) {
      this.hierarchy.push({ "page": this.currentPage, 'userId': user._id, 'user_name': user.user_name, 'user_type_id': typeid });
      sessionStorage.setItem("hierarchy", JSON.stringify(this.hierarchy))
      this.router.navigate(['addChild-agent/' + userid + '/' + typeid])
    } else {
      this.hierarchy.push({ "page": this.currentPage, 'userId': user._id, 'user_name': user.user_name, 'user_type_id': typeid });
      sessionStorage.setItem("hierarchy", JSON.stringify(this.hierarchy))
      this.router.navigate(['addChild-user/' + userid + '/' + typeid])
    }
  }

  // hierarchy =[]
  getUserChildDetail(id, disableHierarchyadding?: boolean) {
    this.usersListReqPageQuery = {
      // user_id: id,
      page: this.currentPage,
      limit: this.itemsPerPage,
      user_name: this.searchQuery,
      // user_type_id: this.type,
      only_end_users : true
    };
    if(this.usersListReqPageQuery.user_name == undefined || this.usersListReqPageQuery.user_name == ''){
      delete this.usersListReqPageQuery.user_name
    }
    if(this.usersListReqPageQuery.user_id == undefined || this.usersListReqPageQuery.user_id == ''){
      delete this.usersListReqPageQuery.user_id
    }
      this.usersService.getChildList(this.usersListReqPageQuery).subscribe(data => {
        if (data.status == true) {
          this.addUserId = id;
          this.userList = data.data;
          this.userList = this.userList.filter(t => t.user_type_id == 1)
          this.expoTotal = this.userList.reduce(
            (a: number, b) => a + b.exposure, 0);
          this.plTotal = this.userList.reduce(
            (a: number, b) => a + b.profit_loss, 0);
          this.balTotal = this.userList.reduce(
            (a: number, b) => a + b.balance, 0);
          this.adminDetails = data.data;
          if(this.userList.length != 0){
            this.total_items = data.metadata.total;
          }
          //this.childLevelFilterValues = [];
          if (this.childLevelFilterValues.length == 0) {
            for (let i = 0; i < this.adminDetails.highestNumberChild; i++) {
              this.childLevelFilterValues.push(i + 1)
            }
          }

          if (disableHierarchyadding) {
            this.hierarchy = []
            let checkforUsername = this.hierarchy.filter(
              hierarchy => hierarchy.userId == data.data._id);
            if (checkforUsername.length == 0) {
              this.hierarchy.push({ "page": this.currentPage, 'userId': data.data._id, 'user_name': data.data.user_name, 'user_type_id': data.data.user_type_id });
            } else {
              this.hierarchy.forEach((element, j) => {
                if (element.userId == checkforUsername[0].userId) {
                  this.hierarchy[j].page = this.currentPage
                }
              });
            }
            if (this.previousRouteService.getPreviousUrl().includes('/addChild-agent/') || this.previousRouteService.getPreviousUrl().includes('/addChild-user/')
              || this.previousRouteService.getPreviousUrl().includes('/user-block-market/') || this.previousRouteService.getPreviousUrl().includes('/downline-report')) {
              let savedHierarchy = JSON.parse(sessionStorage.getItem("hierarchy"))
              this.hierarchy = savedHierarchy
              this.onUserNameClicked(savedHierarchy[savedHierarchy.length - 1].userId, savedHierarchy[savedHierarchy.length - 1].user_type_id, "onclickusername", savedHierarchy[savedHierarchy.length - 1].page)
              this.hierarchy.splice(-1, 1);
            }
          }

          this.userList.forEach(element => {
            this.displayPermissionBox.push(false)
            this.mobileDisplayPermissionBox.push(false)
            this.displayPasswordBox.push(false)
          });
        }
        this.cdref.detectChanges();
      }, error => {
        console.log(error)
      })
   
  }

  downloadCsv() {
    this.usersListReqPageQuery = {
      page: this.currentPage,
      limit: this.itemsPerPage,
      searchQuery: this.searchQuery
    };
    this.usersService.getUserChildDetail(this.user_id, this.usersListReqPageQuery).subscribe(response => {
      if (!response.error) {
        this.excelService.exportAsExcelFile(response.data.childLevelDetails, 'userData');
      }
    }, error => {
      // this.loading = false;
    });
  }

  onUserNameClicked(id, type, fromIndex?: any, page?: number) {
    if (page != undefined && fromIndex != "onclickusername") {
      this.currentPage = page
    } else {
      this.currentPage = 1
    }

    this.usersListReqPageQuery = {
      page: page == undefined ? 1 : page,
      limit: this.itemsPerPage,
      searchQuery: this.searchQuery
    };
    this.getSubUserChild(id, type, fromIndex);

  }

  getSubUserChild(id, type, fromIndex?: any) {
    if (this.isSocket != 1) {
      this.usersListReqPageQuery = {
        user_id: id,
        page: this.currentPage,
        limit: this.itemsPerPage,
        user_name: this.searchQuery,
        // user_type_id: this.type,
        only_end_users : true
      };
      if(this.usersListReqPageQuery.user_name == undefined || this.usersListReqPageQuery.user_name == ''){
        delete this.usersListReqPageQuery.user_name
      }
      if(this.usersListReqPageQuery.user_id == undefined || this.usersListReqPageQuery.user_id == ''){
        delete this.usersListReqPageQuery.user_id
      }
      this.usersService.getChildList( this.usersListReqPageQuery).subscribe(data => {

        if (fromIndex != "onclickusername" && fromIndex != null) {
          let length = this.hierarchy.length
          this.hierarchy.splice(fromIndex, length - fromIndex);
        } else if (fromIndex != null) {
          this.hierarchy.push({ "page": this.currentPage, 'userId': data.data._id, 'user_name': data.data.user_name, 'user_type_id': data.data.user_type_id });
        }
        this.userList = data.data;
        this.expoTotal = this.userList.reduce(
          (a: number, b) => a + b.exposure, 0);
        this.plTotal = this.userList.reduce(
          (a: number, b) => a + b.profit_loss, 0);
        this.balTotal = this.userList.reduce(
          (a: number, b) => a + b.balance, 0);
        this.addUserId = id;
        this.addUserTypeId = type;
        if(this.userList.length != 0){
          this.total_items = data.metadata.total;
        }
      }, error => {
        console.log(error)
      })
    }
    else {
      this.fromIndexCon = fromIndex;
      this.usersListReqPageQuery["user_id"] = id;
      // this.socketEmitEvent('get-user-details-with-child-level-details',
      //   this.usersListReqPageQuery
      // );
    }
  }

  pageChange(newPage: number) {
    this.currentPage = newPage;
    this.usersListReqPageQuery = {
      page: this.currentPage,
      limit: this.itemsPerPage,
      searchQuery: this.searchQuery
    };
    if (this.levelParentUserId != null && this.levelParentUserId != undefined) {
      this.getSubUserChild(this.levelParentUserId, null);
    }
    else {
      this.getUserChildDetail(this.user_id, false);
    }
  }

  addAgent(userid, typeid) {
    sessionStorage.setItem("hierarchy", JSON.stringify(this.hierarchy))
    this.router.navigate(['addChild-agent/' + userid + '/' + typeid])
  }

  changeChildPwd(userId, parentId) {
    if (this.resetPasswordForm.invalid) {
      return
    }
    if (this.isSocket != 1) {
      this.data = {
        "childUserId": userId,
        "newPassword": this.resetPasswordForm.controls.password.value
      }
      this.usersService.changeChildPassword(this.data).subscribe(data => {
        if (data.status == true) {
          this.userParentData = data.data;
          this.getUserChildDetail(parentId, false);
          this.toastr.success(data.msg, '', {
            positionClass: 'toast-bottom-right',
            timeOut: 1000
          });
          this.modalRef.hide();
        } else {
          this.toastr.error(data.msg, '', {
            timeOut: 10000,
          });
        }
      }, error => {
        console.log(error)
      })
    }
    else {
      this.data = {
        "childUserId": userId,
        "newPassword": this.resetPasswordForm.controls.password.value,
        "parentId": parentId
      }
      // this.socketEmitEvent('update-child-password',
      //   this.data
      // );
    }
  }

  // get f() { return this.changePasswordForm.controls; }

  onSubmitChangePassword() {
    this.submitted = true;
    if (this.changePasswordForm.invalid) {
      return;
    }
    if (this.changePasswordForm.controls['new_password'].value == this.changePasswordForm.controls['confirm_password'].value) {
      this.usersService.changePassword(this.selectedUserId, this.changePasswordForm.value).subscribe((result) => {
        if (result.status == true) {
          this.submitted = false;
          this.toastr.success(result.msg, '', {
            positionClass: 'toast-bottom-right',
            timeOut: 1000
          });
          if (this.levelParentUserId != null && this.levelParentUserId != undefined) {
            this.getSubUserChild(this.levelParentUserId, null);
          }
          else {
            this.getUserChildDetail(this.user_id, false);
          }
          this.changePasswordForm.reset();
          this.modalService.hide();
        } else {
          this.toastr.error(result.msg, '', {
            timeOut: 10000,
          });
        }
      }, (err) => {
        console.log(err);
      });
    }

    else {
      this.toastr.error("Password and confirm password did not match", '', {
        timeOut: 10000,
      });
    }


  }

  onChangeStatus(status: any) {
    this.selectedStatus = status;
  }

  onChangeCall() {
    if(this.selectedStatus == 0) {
      return
    }
    if (this.selectedStatus == 1) {
      var obj: any = {
        self_lock_user : 0
      };
      if (this.isSocket != 1) {
        this.usersService.lockUserAccount(this.selectedUserId, obj).subscribe((result) => {
          if (result.status == true) {
            if (this.levelParentUserId != null && this.levelParentUserId != undefined) {
              this.getSubUserChild(this.levelParentUserId, null);
            }
            else {
              this.getUserChildDetail(this.user_id, false);
            }
            this.toastr.success(result.msg, '', {
              positionClass: 'toast-bottom-right',
              timeOut: 1000
            });
            this.modalRef.hide();
          } else {
            this.toastr.error(result.msg, '', {
              timeOut: 10000,
            });
          }
        }, (err) => {
          console.log(err);
        });
      }

    } else  if (this.selectedStatus == 2) {
      var obj: any = {
        self_lock_user : 1
      };
      if (this.isSocket != 1) {
        this.usersService.lockUserAccount(this.selectedUserId, obj).subscribe((result) => {
          if (result.status == true) {
            if (this.levelParentUserId != null && this.levelParentUserId != undefined) {
              this.getSubUserChild(this.levelParentUserId, null);
            }
            else {
              this.getUserChildDetail(this.user_id, false);
            }
            this.toastr.success(result.msg, '', {
              positionClass: 'toast-bottom-right',
              timeOut: 1000
            });
            this.modalRef.hide();
          } else {
            this.toastr.error(result.msg, '', {
              timeOut: 10000,
            });
          }
        }, (err) => {
          console.log(err);
        });
      }
    } else  if (this.selectedStatus == 3) {

      if (this.isSocket != 1) {
        this.usersService.updateUserBettingLockUnlock(this.selectedUser._id).subscribe((result) => {
          if (result.status == true) {
            this.toastr.success(result.msg, '', {
              positionClass: 'toast-bottom-right',
              timeOut: 1000
            });
           this.fancyBetLock();
          }
        });
      }

    }
  }
  fancyBetLock(){

    let data = {
      user_id: this.selectedUser._id,
      is_child_lock: this.selectedUser.self_lock_fancy_bet == 0 ? 1 : 0
    }
    if (this.selectedUser.self_lock_fancy_bet == 0) {
      if (this.isSocket != 1) {
        this.usersService.updateUserStatusFancyBetLock(data).subscribe((result) => {
          if (result.status == true) {
            this.toastr.success(result.msg, '', {
              positionClass: 'toast-bottom-right',
              timeOut: 1000
            });
            this.getUserChildDetail(this.selectedUser.parent_id, false);
            this.modalRef.hide();
          }
        });
      }
    } else {
      if (this.isSocket != 1) {
        this.usersService.updateUserStatusFancyBetUnlock(data).subscribe((result) => {
          if (result.status == true) {
            this.toastr.success(result.msg);
            this.getUserChildDetail(this.selectedUser.parent_id, false);
          }
          this.modalRef.hide();
        });
      }
    }
  }
  lockAccountOfUserAndTheirChilds(userid, self_lock_user) {
    var obj: any = {};
    var message = '';
    if (self_lock_user == 0) {
      obj.self_lock_user = 1;
      message = "Are you sure you want to lock this user account!"
    }
    if (self_lock_user == 1) {
      obj.self_lock_user = 0;
      message = "Are you sure you want to unlock this user account!"
    }
    this.selectedUserId = userid;
    Swal.fire({
      title: 'Are you sure?',
      text: message,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.isConfirmed) {
        if (this.isSocket != 1) {
          this.usersService.lockUserAccount(this.selectedUserId, obj).subscribe((result) => {
            if (result.status == true) {
              if (this.levelParentUserId != null && this.levelParentUserId != undefined) {
                this.getSubUserChild(this.levelParentUserId, null);
              }
              else {
                this.getUserChildDetail(this.user_id, false);
              }
              this.toastr.success(result.msg, '', {
                positionClass: 'toast-bottom-right',
                timeOut: 1000
              });
              this.modalRef.hide();
            } else {
              this.toastr.error(result.msg, '', {
                timeOut: 10000,
              });
            }
          }, (err) => {
            console.log(err);
          });
        }
        else {
          obj.user_id = userid;
          // this.socketEmitEvent('lock-and-unlock-account-of-user',
          //   obj
          // );
        }
      } else if (result.dismiss === Swal.DismissReason.cancel) {
      }
    })
  }

  closeAccountOfUserAndTheirChilds(userid, self_close_account, balance, liability, pl) {
    if (balance == 0 && liability == 0 && pl == 0) {
      var obj: any = {};
      // var message = '';
      if (self_close_account == 0) {
        obj.self_close_account = 1;
        // message = "Are you sure you want to close this user account!"
      }
      if (self_close_account == 1) {
        obj.self_close_account = 0;
        // message = "Are you sure you want to reopen this user account!"
      }
      this.selectedUserId = userid;
      if (this.isSocket != 1) {
        this.usersService.closeAndReOpenAccountOfUserAndTheirChilds(this.selectedUserId, obj).subscribe((result) => {
          if (result.status == true) {
            if (this.levelParentUserId != null && this.levelParentUserId != undefined) {
              this.getSubUserChild(this.levelParentUserId, null);
            }
            else {
              this.getUserChildDetail(this.user_id, false);
            }
            this.toastr.success(result.msg, '', {
              positionClass: 'toast-bottom-right',
              timeOut: 1000
            });
            this.modalRef.hide();
          } else {
            this.toastr.error(result.msg, '', {
              timeOut: 10000,
            });
          }
        }, (err) => {
          console.log(err);
        });
      }
      else {
        obj.user_id = userid;
        // this.socketEmitEvent('close-and-re-open-account-of-user-and-their-childs',
        //   obj
        // );
      }
      // Swal.fire({
      //   title: 'Are you sure?',
      //   text: message,
      //   icon: 'warning',
      //   showCancelButton: true,
      //   confirmButtonText: 'Yes',
      //   cancelButtonText: 'No'
      // }).then((result) => {
      //   if (result.isConfirmed) {
          
      //   } else if (result.dismiss === Swal.DismissReason.cancel) {
      //   }
      // })
    } else {
      this.modalRef.hide();
      alert("First Clear Exposure , Balance & Settlement amount. After then you will close A/C successfully....");
      this.getUserChildDetail(this.user_id, false);
    }

  }

  allowAndNotAllowAgentsMultiLogin(user_id) {
    this.selectedUserId = user_id;
    var obj: any = {};
    obj.user_id = user_id;
    this.usersService.allowAndNotAllowAgentsMultiLogin(obj).subscribe((result) => {
      if (result.status == true) {
        if (this.levelParentUserId != null && this.levelParentUserId != undefined)
          this.getSubUserChild(this.levelParentUserId, null);
        else
          this.getUserChildDetail(this.user_id, false);
        this.toastr.success(result.msg, '', {
          positionClass: 'toast-bottom-right',
          timeOut: 1000
        });
      } else {
        this.toastr.error(result.msg, '', {
          timeOut: 10000,
        });
      }
    }, (err) => {
      console.log(err);
    });
  }

  setSelectedOption(selectedOption) {
    this.itemsPerPage = parseInt(selectedOption);
    this.usersListReqPageQuery = {
      page: this.currentPage,
      limit: this.itemsPerPage,
      searchQuery: this.searchQuery
    };
    if (this.levelParentUserId != null && this.levelParentUserId != undefined) {
      this.getSubUserChild(this.levelParentUserId, null);
    }
    else {
      this.getUserChildDetail(this.user_id, false);
    }
  }

  searchFilter() {
    this.usersListReqPageQuery = {
      page: this.currentPage,
      limit: this.itemsPerPage,
      searchQuery: this.searchQuery,
      domainId: this.searchdomainId,
      levelId: this.searchlevelId
    };
    if (this.levelParentUserId != null && this.levelParentUserId != undefined) {
      this.getUserChildDetail(this.levelParentUserId, false);
    }
    else {
      this.getUserChildDetail(this.user_id, false);
    }
  }

  reset() {
    this.searchQuery = '';
    this.searchdomainId = '';
    this.usersListReqPageQuery = {
      page: this.currentPage,
      limit: this.itemsPerPage,
      searchQuery: this.searchQuery,
      domainId: this.searchdomainId,
      levelId: 'all'
    };
    if (this.levelParentUserId != null && this.levelParentUserId != undefined) {
      this.getUserChildDetail(this.levelParentUserId, false);
    }
    else {
      this.getUserChildDetail(this.user_id, false);
    }
  }

  openShowPasswordTooltip(password: string, index) {
    if (!this.displayPasswordBox[index]) {
      this.displayPasswordBox.forEach((element, index) => {
        this.displayPasswordBox[index] = false
      });
    }
    this.displayPasswordBox[index] = !this.displayPasswordBox[index];
    // setTimeout(() => {
    //   this.closeUserPasswordDiv(index)
    // }, 3000);
  }

  applyValidationToFormGroup(formGroupName, jsonArrayName) {
    this.appValidationService.applyValidationRulesToFromGroup(formGroupName, jsonArrayName).then((validators) => {
    }).catch(() => { })
  }

  getPartnershipListByUserId(userId, username) {
    this.selectedUserId = userId
    this.showSelectedUserName = username;
    var obj: any = {};
    obj.user_id = userId;
    this.addedSportShareList = [];
    if (this.isSocket != 1) {
      this.usersService.getPartnershipListByUserId(obj).subscribe((result) => {
        if (result.status == true) {
          this.selectedUserPartnershipList = result.data.sports_share;
          for (var i = 0; i < this.selectedUserPartnershipList.length; i++) {
            this.addedSportShareList.push({ sport: this.selectedUserPartnershipList[i].sport, sport_id: this.selectedUserPartnershipList[i].sport_id, name: this.selectedUserPartnershipList[i].name, percentage: [] });
            for (var j = 0; j <= this.selectedUserPartnershipList[i].percentage.length; j++) {
              if (j < this.selectedUserPartnershipList[i].percentage.length) {
                var percentage = this.selectedUserPartnershipList[i].percentage[j];
                delete percentage._id;
                delete percentage.parent_id;
                // delete percentage.parent_partnership_share ;
                // delete percentage.share ;
                delete percentage.user_id;
                delete percentage.user_name;
                // if (j == this.selectedUserPartnershipList[i].percentage.length - 1) {
                //   percentage.share = 0;
                // }
                // if (this.userDetail.user_type_id == 0) {
                //   percentage.parent_share = 100;
                // }
                this.addedSportShareList[i].percentage.push(percentage);
              }
              // else {
              //   this.addedSportShareDetails = {
              //     user_type_id: this.selectedUserPartnershipList[i].percentage[this.selectedUserPartnershipList[i].percentage.length - 1].user_type_id,
              //     parent_share: this.selectedUserPartnershipList[i].percentage[this.selectedUserPartnershipList[i].percentage.length - 1].parent_share,
              //     user_share: this.selectedUserPartnershipList[i].percentage[this.selectedUserPartnershipList[i].percentage.length - 1].user_share,
              //   }
              //   // if (this.userDetail.user_type_id != 0) {
              //   //   this.addedSportShareDetails.parent_share = this.selectedUserPartnershipList[i].percentage[this.selectedUserPartnershipList[i].percentage.length - 1].user_share
              //   // }
              //   this.addedSportShareList[i].percentage.push(this.addedSportShareDetails);
              // }
            }
          }
          this.checkUserSportShareForDisplay();
        } else {
          this.toastr.error(result.msg, '', {
            timeOut: 10000,
          });
        }
      }, (err) => {
        console.log(err);
      });
    }
    else {
      // this.socketEmitEvent('get-partnership-list-by-userId',
      //   obj
      // );
    }
  }

  getPartnershipListByUserIdforPopUp(userId, username) {
    this.selectedUserId = userId
    this.showSelectedUserName = username;
    var obj: any = {};
    obj.user_id = userId;
    this.addedSportShareList = [];
    if (this.isSocket != 1) {
      this.usersService.getPartnershipListByUserId(obj).subscribe((result) => {
        if (result.status == true) {
          this.selectedUserPartnershipList = result.data.sports_share;
          for (var i = 0; i < this.selectedUserPartnershipList.length; i++) {
            this.addedSportShareList.push({ sport: this.selectedUserPartnershipList[i].sport, sport_id: this.selectedUserPartnershipList[i].sport_id, name: this.selectedUserPartnershipList[i].name, percentage: [] });
            for (var j = 0; j <= this.selectedUserPartnershipList[i].percentage.length; j++) {
              if (j < this.selectedUserPartnershipList[i].percentage.length) {
                var percentage = this.selectedUserPartnershipList[i].percentage[j];
                this.addedSportShareList[i].percentage.push(percentage);
              }
            }
          }
          this.checkUserSportShareForDisplay();
        } else {
          this.toastr.error(result.msg, '', {
            timeOut: 10000,
          });
        }
      }, (err) => {
        console.log(err);
      });
    }
    else {
      // this.socketEmitEvent('get-partnership-list-by-userId',
      //   obj
      // );
    }
  }
  checkUserSportShareForDisplay() {
    this.tempUserShareSportList = [];
    for (var i = 0; i < this.selectedUserPartnershipList.length; i++) {
      this.tempUserShareSportList.push({ "userCurrentShare": this.selectedUserPartnershipList[i].percentage[this.selectedUserPartnershipList[i].percentage.length - 1].user_share })
    }
  }

  updatePartnershipList() {
    if (this.isUpdateShareValid) {
      if (this.updatePartnershipPassword == null || this.updatePartnershipPassword == undefined || this.updatePartnershipPassword == '') {
        this.toastr.error("Please enter password", '', {
          timeOut: 10000,
        });
        return
      }
      var updatePartnershipObj: any = {};
      updatePartnershipObj.sports_share = this.addedSportShareList;
      updatePartnershipObj.user_id = this.selectedUserId;
      updatePartnershipObj.password = this.updatePartnershipPassword;
      if (this.isSocket != 1) {
        this.usersService.updatePartnershipList(updatePartnershipObj).subscribe((result) => {
          if (result.status == true) {
            this.toastr.success(result.msg, '', {
              positionClass: 'toast-bottom-right',
              timeOut: 1000
            });
            if (this.levelParentUserId != null && this.levelParentUserId != undefined) {
              this.getSubUserChild(this.levelParentUserId, null);
            }
            else {
              this.getUserChildDetail(this.user_id, false);
            }
            this.modalService.hide();
          } else {
            this.toastr.error(result.msg, '', {
              timeOut: 10000,
            });
          }
        }, (err) => {
          console.log(err);
        });
      }
      else {
        // this.socketEmitEvent('update-partnership-list',
        //   updatePartnershipObj
        // );
      }
    }
    else {
      this.toastr.error("Please enter valid share", '', {
        timeOut: 10000,
      });
    }
  }

  checkUserEnteredShare(user_share, parent_share, sport, index) {
    if (user_share > parent_share) {
      this.isUpdateShareValid = true;
      this.addedSportShareList[index].percentage[this.addedSportShareList[index].percentage.length - 1].user_share = parseInt(user_share);
      this.addedSportShareList[index].percentage[this.addedSportShareList[index].percentage.length - 1].share = parseInt(user_share);
      this.addedSportShareList[index].percentage[this.addedSportShareList[index].percentage.length - 1].parent_partnership_share = (parseInt(this.addedSportShareList[index].percentage[this.addedSportShareList[index].percentage.length - 2].parent_share) - parseInt(user_share));
      this.addedSportShareList[index].percentage[this.addedSportShareList[index].percentage.length - 2].share = (parseInt(this.addedSportShareList[index].percentage[this.addedSportShareList[index].percentage.length - 2].parent_share) - parseInt(user_share));
      this.addedSportShareList[index].percentage[this.addedSportShareList[index].percentage.length - 1].parent_share = (parseInt(user_share));
      this.addedSportShareList[index].percentage[this.addedSportShareList[index].percentage.length - 2].user_share = parseInt(user_share);
    }
    else {
      this.isUpdateShareValid = false;
    }
  }

  downloadPDF() {
    var data = document.getElementById('contentToConvert');  //Id of the table
    html2canvas(data).then(canvas => {
      let imgWidth = 208;
      let pageHeight = 295;
      let imgHeight = canvas.height * imgWidth / canvas.width;
      let heightLeft = imgHeight;
      const contentDataURL = canvas.toDataURL('image/png')
      let pdf = new jspdf('p', 'mm', 'a4'); // A4 size page of PDF  
      let position = 0;
      pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight)
      pdf.save('MYPdf.pdf'); // Generated PDF   
    });
  }

  checkedBetAllow(event, user_id, parentId) {
    if (this.isSocket != 1) {
      this.usersService.updateUserBettingLockUnlock(user_id).subscribe((result) => {
        if (result.status == true) {
          this.toastr.success(result.msg, '', {
            positionClass: 'toast-bottom-right',
            timeOut: 1000
          });
          // this.getUserChildDetail(parentId, false);
        }
      });
    }
    else {
      // this.socketEmitEvent('update-user-status-betting-lock-unlock',
      //   { user_id: user_id }
      // );
    }
  }

  checkedFancyBetAllow(event, user_id, parentId, userSelf_lock_fancy_bet) {
    let data = {
      user_id: user_id,
      is_child_lock: userSelf_lock_fancy_bet == 0 ? 1 : 0
    }
    if (userSelf_lock_fancy_bet == 0) {
      if (this.isSocket != 1) {
        this.usersService.updateUserStatusFancyBetLock(data).subscribe((result) => {
          if (result.status == true) {
            this.toastr.success(result.msg, '', {
              positionClass: 'toast-bottom-right',
              timeOut: 1000
            });
            this.getUserChildDetail(parentId, false);
            this.modalRef.hide();
          }
        });
      }
      else {
        // this.socketEmitEvent('update-user-status-fancy-bet-lock',
        //   data
        // );
      }
    } else {
      if (this.isSocket != 1) {
        this.usersService.updateUserStatusFancyBetUnlock(data).subscribe((result) => {
          if (result.status == true) {
            this.toastr.success(result.msg);
            this.getUserChildDetail(parentId, false);
          }
          this.modalRef.hide();
        });
      }
      else {
        // this.socketEmitEvent('update-user-status-fancy-bet-unlock',
        //   data
        // );
      }
    }
  }

  getAllwebsite() {
    if (this.isSocket != 1) {
      this.websiteSettingService.getAllwebsite().subscribe(res => {
        this.searchedwebsiteList = res.data
      })
    }
    else {
      // this.socketEmitEvent('get-website-list', '');
    }
  }

  get sportsSettingsFormArr(): FormArray {
    return this.sportsForm.get('sports_settings') as FormArray;
  }
  createSportsSettingArray(user?: any) {
    this.sportsForm.get('sports_settings')['controls'] = []
    this.specificUserDetails.forEach((sport, index) => {
      this.sportsSettingsFormArr.push(
        this.fb.group({
          sport: sport.sport,
          sport_id: sport.sport_id,
          market_bet_delay: [sport.market_bet_delay, Validators.required],
          market_min_stack: [sport.market_min_stack, Validators.required],
          market_max_stack: [sport.market_max_stack, Validators.required],
          market_max_profit: [sport.market_max_profit, Validators.required],
          market_min_odds_rate: [sport.market_min_odds_rate, Validators.required],
          market_max_odds_rate: [sport.market_max_odds_rate, Validators.required],
          market_advance_bet_stake: [sport.market_advance_bet_stake, Validators.required],
          session_bet_delay: [sport.session_bet_delay, Validators.required],
          session_min_stack: [sport.session_min_stack, Validators.required],
          session_max_stack: [sport.session_max_stack, Validators.required],
          session_max_profit: [sport.session_max_profit, Validators.required],
          name: sport.name
        })
      );
      // this.sportsSettingsFormArr.controls.forEach((sport, index) => {
      //   for (const key in this.sportsSettingsFormArr.controls[index]['controls']) {
      //     this.sportsSettingsFormArr.controls[index].get(key).clearValidators();
      //     this.sportsSettingsFormArr.controls[index].get(key).updateValueAndValidity();
      // }
      // });
      if (!user.check_event_limit) {
        this.sportsSettingsFormArr.controls[index]['controls'].market_min_stack.setValidators([ValidatorControls.requiredValidator("Market Min Stack is required"), ValidatorControls.minValueValidator(1, true, "Market Min Stack value should not be less than or equal to 0", false)])
        this.sportsSettingsFormArr.controls[index]['controls'].market_max_stack.setValidators([ValidatorControls.requiredValidator("Market Max Stack is required"), ValidatorControls.minValueValidator(this.sportsSettingsFormArr.controls[index]['controls'].market_min_stack.value, true, "Market Max Stack value should not be less than Market Min Stack", false), ValidatorControls.maxValueValidator(this.specificUserParentDetails[index].market_max_stack_max_limit, true, "Market Max Stack value should not be greater than " + this.specificUserParentDetails[index].market_max_stack_max_limit)])
        this.sportsSettingsFormArr.controls[index]['controls'].market_min_odds_rate.setValidators([ValidatorControls.requiredValidator("Market Min odds rate is required"), ValidatorControls.minValueValidator(this.specificUserParentDetails[index].market_min_odds_rate, true, "Market Min odds rate value should not be less " + this.specificUserParentDetails[index].market_min_odds_rate, false)])
        this.sportsSettingsFormArr.controls[index]['controls'].market_max_odds_rate.setValidators([ValidatorControls.requiredValidator("Market Max odds rate is required"), ValidatorControls.minValueValidator(this.sportsSettingsFormArr.controls[index]['controls'].market_min_odds_rate.value, true, "Market Max odds rate value should not be less than Market Min odds rate", false), ValidatorControls.maxValueValidator(this.specificUserParentDetails[index].market_max_odds_rate, true, "Market Max odds rate value should not be greater than " + this.specificUserParentDetails[index].market_max_odds_rate)])
        this.sportsSettingsFormArr.controls[index]['controls'].market_max_profit.setValidators([ValidatorControls.requiredValidator("Market Max profit is required"), ValidatorControls.minValueValidator(this.specificUserParentDetails[index].market_profit_range, true, "Market Max profit value should not be less than " + this.specificUserParentDetails[index].market_profit_range, false), ValidatorControls.maxValueValidator(this.specificUserParentDetails[index].market_max_profit, true, "Market Max Profit rate value should not be greater than " + this.specificUserParentDetails[index].market_max_profit)])
        this.sportsSettingsFormArr.controls[index]['controls'].market_advance_bet_stake.setValidators([ValidatorControls.requiredValidator("Before Inplay Match Stake is required"), ValidatorControls.minValueValidator(1, true, "Before Inplay Match Stake value should not be less than or equal to 0 ", false), ValidatorControls.maxValueValidator(this.specificUserParentDetails[index].market_advance_bet_stake, true, "Before Inplay Match Stake value should not be more than " + this.specificUserParentDetails[index].market_advance_bet_stake)])
        this.sportsSettingsFormArr.controls[index]['controls'].market_bet_delay.setValidators([ValidatorControls.requiredValidator("Match Bets Delay is required"), ValidatorControls.minValueValidator(this.specificUserParentDetails[index].market_min_bet_delay, true, "Match Bets Delay value should not be less than " + this.specificUserParentDetails[index].market_min_bet_delay, false), ValidatorControls.maxValueValidator(this.specificUserParentDetails[index].market_max_bet_delay, true, "Match Bets Delay value should not be more than " + this.specificUserParentDetails[index].market_max_bet_delay)])
        this.sportsSettingsFormArr.controls[index]['controls'].session_min_stack.setValidators([ValidatorControls.requiredValidator("Min. Stake Amount  is required"), ValidatorControls.minValueValidator(1, true, "Min. Stake Amount value should not be less than or equal to 0", false)])
        this.sportsSettingsFormArr.controls[index]['controls'].session_bet_delay.setValidators([ValidatorControls.requiredValidator("Session Bet Delay is required"), ValidatorControls.minValueValidator(this.specificUserParentDetails[index].session_min_bet_delay, true, "Session Bet Delay value should not be less than or equal to " + this.specificUserParentDetails[index].session_min_bet_delay, false), ValidatorControls.maxValueValidator(this.specificUserParentDetails[index].session_max_bet_delay, true, "Session Bet Delay value should not be more than " + this.specificUserParentDetails[index].session_max_bet_delay)])
        this.sportsSettingsFormArr.controls[index]['controls'].session_max_stack.setValidators([ValidatorControls.requiredValidator("Max. Stake Amount is required"), ValidatorControls.minValueValidator(this.sportsSettingsFormArr.controls[index]['controls'].session_min_stack.value, true, "Max. Stake Amount value should not be less than min Stake Amount value", false), ValidatorControls.maxValueValidator(this.specificUserParentDetails[index].session_max_stack_max_limit, true, "Max. Stake Amount value should not be greater than " + this.specificUserParentDetails[index].session_max_stack_max_limit)])
        this.sportsSettingsFormArr.controls[index]['controls'].session_max_profit.setValidators([ValidatorControls.requiredValidator("Session Max Profit is required"), ValidatorControls.minValueValidator(this.specificUserParentDetails[index].session_profit_range, true, "Session Max Profit value should not be less than " + this.specificUserParentDetails[index].session_profit_range, false), ValidatorControls.maxValueValidator(this.specificUserParentDetails[index].session_max_profit, true, "Session Max Profit rate value should not be greater than " + this.specificUserParentDetails[index].session_max_profit)])
      } else {
        this.sportsSettingsFormArr.controls[index]['controls'].market_min_stack.setValidators([ValidatorControls.requiredValidator("Market Min Stack is required"), ValidatorControls.minValueValidator(this.specificUserParentDetails[index].market_min_stack, true, "Market Min Stack value should not be less than parent value", false)])
        this.sportsSettingsFormArr.controls[index]['controls'].market_max_stack.setValidators([ValidatorControls.requiredValidator("Market Max Stack is required"), ValidatorControls.minValueValidator(this.sportsSettingsFormArr.controls[index]['controls'].market_min_stack.value, true, "Market Max Stack value should not be less than Market Min Stack", false), ValidatorControls.maxValueValidator(this.specificUserParentDetails[index].market_max_stack, true, "Market Max Stack value should not be greater than parent value")])
        this.sportsSettingsFormArr.controls[index]['controls'].market_min_odds_rate.setValidators([ValidatorControls.requiredValidator("Market Min odds rate is required"), ValidatorControls.minValueValidator(this.specificUserParentDetails[index].market_min_odds_rate, true, "Market Min odds rate value should not be less than parent value", false)])
        this.sportsSettingsFormArr.controls[index]['controls'].market_max_odds_rate.setValidators([ValidatorControls.requiredValidator("Market Max odds rate is required"), ValidatorControls.minValueValidator(this.sportsSettingsFormArr.controls[index]['controls'].market_min_odds_rate.value, true, "Market Max odds rate value should not be less than Market Min odds rate", false), ValidatorControls.maxValueValidator(this.specificUserParentDetails[index].market_max_odds_rate, true, "Market Max odds rate value should not be greater than parent value")])
        this.sportsSettingsFormArr.controls[index]['controls'].market_max_profit.setValidators([ValidatorControls.requiredValidator("Market Max profit is required"), ValidatorControls.minValueValidator(1, true, "Market Max profit value should not be less than or equal to 0 ", false), ValidatorControls.maxValueValidator(this.specificUserParentDetails[index].market_max_profit, true, "Market Max profit value should not be greater than parent value")])
        this.sportsSettingsFormArr.controls[index]['controls'].market_advance_bet_stake.setValidators([ValidatorControls.requiredValidator("Before Inplay Match Stake is required"), ValidatorControls.minValueValidator(1, true, "Before Inplay Match Stake value should not be less than or equal to 0 ", false), ValidatorControls.maxValueValidator(this.specificUserParentDetails[index].market_advance_bet_stake, true, "Before Inplay Match Stake value should not be greater than parent value")])
        this.sportsSettingsFormArr.controls[index]['controls'].market_bet_delay.setValidators([ValidatorControls.requiredValidator("Match Bets Delay is required"), ValidatorControls.minValueValidator(this.specificUserParentDetails[index].market_bet_delay, true, "Match Bets Delay value should not be less than parent value", false), ValidatorControls.maxValueValidator(10, true, "Match Bets Delay value should not be more than 10")])
        this.sportsSettingsFormArr.controls[index]['controls'].session_min_stack.setValidators([ValidatorControls.requiredValidator("Min. Stake Amount  is required"), ValidatorControls.minValueValidator(this.specificUserParentDetails[index].session_min_stack, true, "Min. Stake Amount value should not be less than parent value", false)])
        this.sportsSettingsFormArr.controls[index]['controls'].session_bet_delay.setValidators([ValidatorControls.requiredValidator("Session Bet Delay is required"), ValidatorControls.minValueValidator(this.specificUserParentDetails[index].session_bet_delay, true, "Session Bet Delay value should not be less than parent value", false), ValidatorControls.maxValueValidator(10, true, "Session Bet Delay value should not be more than 10")])
        this.sportsSettingsFormArr.controls[index]['controls'].session_max_stack.setValidators([ValidatorControls.requiredValidator("Max. Stake Amount is required"), ValidatorControls.minValueValidator(this.sportsSettingsFormArr.controls[index]['controls'].session_min_stack.value, true, "Max. Stake Amount value should not be less than min Stake Amount value", false), ValidatorControls.maxValueValidator(this.specificUserParentDetails[index].session_max_stack, true, "Max. Stake Amount value should not be greater than parent value")])
        this.sportsSettingsFormArr.controls[index]['controls'].session_max_profit.setValidators([ValidatorControls.requiredValidator("Session Max Profit is required"), ValidatorControls.minValueValidator(1, true, "Session Max Profit value should not be less than or equal to 0 ", false), ValidatorControls.maxValueValidator(this.specificUserParentDetails[index].session_max_profit, true, "Session Max Profit value should not be greater than parent value")])
        // });
      }
      this.sportsSettingsFormArr.updateValueAndValidity();
      // this.applyValidationToFormGroup(this.sportsSettingsFormArr.controls[index], "sportsSettings")
      // this.sportsSettingsFormArr.controls[index]['controls'].market_min_stack.setValidators([ValidatorControls.requiredValidator("Market Min Stack is required"), ValidatorControls.minValueValidator(this.specificUserParentDetails[index].market_min_stack, true, "Market Min Stack value should not be less than parent value", false)])
      // this.sportsSettingsFormArr.controls[index]['controls'].market_max_stack.setValidators([ValidatorControls.requiredValidator("Market Max Stack is required"), ValidatorControls.minValueValidator(this.sportsSettingsFormArr.controls[index]['controls'].market_min_stack.value, true, "Market Max Stack value should not be less than Market Min Stack", false), ValidatorControls.maxValueValidator(this.specificUserParentDetails[index].market_max_stack, true, "Market Max Stack value should not be greater than parent value")])
      // this.sportsSettingsFormArr.controls[index]['controls'].market_min_odds_rate.setValidators([ValidatorControls.requiredValidator("Market Min odds rate is required"), ValidatorControls.minValueValidator(this.specificUserParentDetails[index].market_min_odds_rate, true, "Market Min odds rate value should not be less than parent value", false)])
      // this.sportsSettingsFormArr.controls[index]['controls'].market_max_odds_rate.setValidators([ValidatorControls.requiredValidator("Market Max odds rate is required"), ValidatorControls.minValueValidator(this.sportsSettingsFormArr.controls[index]['controls'].market_min_odds_rate.value, true, "Market Max odds rate value should not be less than Market Min odds rate", false), ValidatorControls.maxValueValidator(this.specificUserParentDetails[index].market_max_odds_rate, true, "Market Max odds rate value should not be greater than parent value")])
      // this.sportsSettingsFormArr.controls[index]['controls'].market_max_profit.setValidators([ValidatorControls.requiredValidator("Market Max profit is required"), ValidatorControls.minValueValidator(1, true, "Market Max profit value should not be less than or equal to 0 ", false),ValidatorControls.maxValueValidator(this.specificUserParentDetails[index].market_max_profit, true, "Market Max profit value should not be greater than parent value")])
      // this.sportsSettingsFormArr.controls[index]['controls'].market_advance_bet_stake.setValidators([ValidatorControls.requiredValidator("Before Inplay Match Stake is required"),ValidatorControls.minValueValidator(1, true, "Before Inplay Match Stake value should not be less than or equal to 0 ", false), ValidatorControls.maxValueValidator(this.specificUserParentDetails[index].market_advance_bet_stake, true, "Before Inplay Match Stake value should not be greater than parent value")])
      // this.sportsSettingsFormArr.controls[index]['controls'].market_bet_delay.setValidators([ValidatorControls.requiredValidator("Match Bets Delay is required"), ValidatorControls.minValueValidator(this.specificUserParentDetails[index].market_bet_delay, true, "Match Bets Delay value should not be less than parent value", false),ValidatorControls.maxValueValidator(10, true, "Match Bets Delay value should not be more than 10")])
      // this.sportsSettingsFormArr.controls[index]['controls'].session_min_stack.setValidators([ValidatorControls.requiredValidator("Min. Stake Amount  is required"), ValidatorControls.minValueValidator(this.specificUserParentDetails[index].session_min_stack, true, "Min. Stake Amount value should not be less than parent value", false)])
      // this.sportsSettingsFormArr.controls[index]['controls'].session_bet_delay.setValidators([ValidatorControls.requiredValidator("Session Bet Delay is required"), ValidatorControls.minValueValidator(this.specificUserParentDetails[index].session_bet_delay, true, "Session Bet Delay value should not be less than parent value", false),ValidatorControls.maxValueValidator(10, true, "Session Bet Delay value should not be more than 10")])
      // this.sportsSettingsFormArr.controls[index]['controls'].session_max_stack.setValidators([ValidatorControls.requiredValidator("Max. Stake Amount is required"), ValidatorControls.minValueValidator(this.sportsSettingsFormArr.controls[index]['controls'].session_min_stack.value, true, "Max. Stake Amount value should not be less than min Stake Amount value", false), ValidatorControls.maxValueValidator(this.specificUserParentDetails[index].session_max_stack, true, "Max. Stake Amount value should not be greater than parent value")])
      // this.sportsSettingsFormArr.controls[index]['controls'].session_max_profit.setValidators([ValidatorControls.requiredValidator("Session Max Profit is required"),ValidatorControls.minValueValidator(1, true, "Session Max Profit value should not be less than or equal to 0 ", false), ValidatorControls.maxValueValidator(this.specificUserParentDetails[index].session_max_profit, true, "Session Max Profit value should not be greater than parent value")])
      this.hiddenpass.push(true)

    });
    // this.sportsSettingsFormArr.controls.forEach((element, index) => {
    //   this.applyValidationToFormGroup(this.sportsSettingsFormArr.controls[index], "sportsSettings")
    // });

  }

  selectPill(i) {
    this.selectedIndex = i;
  }
  hide(index) {
    this.hiddenpass[index] = !this.hiddenpass[index];
  }


  updateSportWiseSettingDetails(sport, sportIndex) {
    let compareResult = this.objectsAreSame(this.sportsForm.controls.sports_settings.value[sportIndex], this.specificUserDetails[sportIndex])
    if (!compareResult.objectsAreSame) {
      // compareResult.differentValueObject['sport_id'] = this.sportsForm.controls.sports_settings.value[sportIndex].sport_id
      // compareResult.differentValueObject['sport'] = this.sportsForm.controls.sports_settings.value[sportIndex].sport
      // compareResult.differentValueObject['name'] = this.sportsForm.controls.sports_settings.value[sportIndex].name
      let filteredSports_settings = []
      filteredSports_settings.push(compareResult.differentValueObject);
      let data = {
        user_id: this.selectedUserId,
        sport_id: this.sportsForm.controls.sports_settings.value[sportIndex].sport_id,
        sports_settings: filteredSports_settings
      }
      if (this.sportsForm.invalid) {
        return
      }


      if (this.isSocket != 1) {
        this.usersService.updateSportWiseSettingDetails(data).subscribe(result => {
          if (result.status == true) {
            this.sportErrorData = undefined
            this.toastr.success(result.msg, '', {
              positionClass: 'toast-bottom-right',
              timeOut: 1000
            });
            // this.modalService.hide()
          } else if (result.is_validation_error) {
            this.sportErrorData = result.data
            this.toastr.error(result.msg, '', {
              timeOut: 10000,
            });
          }
        })
      }
      else {
        // this.socketEmitEvent('update-sport-wise-setting-details', data);
      }
    } else {
      this.toastr.error("Same Data Found. Plz update it", '', {
        timeOut: 10000,
      })
    }
  }

  getUserSportsWiseSettingDetails(user_id, settingId, user) {
    if (this.isSocket != 1) {
      this.usersService.getSportSetting({ user_id: user_id, '_id': settingId }).subscribe(result => {
        this.specificUserDetails = result.data.sports_settings;
        if (result.data.sports_settings.length !== result.data.parent_sports_settings.length) {
          this.specificUserParentDetails = []
          this.specificUserDetails.forEach((element, index) => {

            this.specificUserParentDetails.push(result.data.parent_sports_settings[0])
          });
        } else {
          this.specificUserParentDetails = result.data.parent_sports_settings
        }

        this.createSportsSettingArray(user)
      })
    }
    else {
      // this.socketEmitEvent('get-user-sports-wise-setting-details', { userid: user_id });
    }
  }

  blockMaster(user) {
    sessionStorage.setItem("hierarchy", JSON.stringify(this.hierarchy))
    this.router.navigate(['user-block-market/' + user._id + '/' + user.user_type_id])
  }

  async getUserRawPassword() {
    var rawPasswordObj: any = {}
    rawPasswordObj.user_id = this.selectedUserId;
    rawPasswordObj.password = this.transactionPassword;
    this.usersService.getUserRawPassword(rawPasswordObj).subscribe(async result => {
      if (result.status == true) {
        // if (!this.cookie.get('transaction-password')) {
        //   const dateNow = new Date();
        //   var timeout = parseInt(this.cookie.get('transaction_password_timeout'));
        //   dateNow.setHours(dateNow.getHours() + timeout);
        //   const encTrans = await this.usersService.encryptData(this.transactionPassword);
        //   this.cookie.set('transaction-password', encTrans, dateNow)
        // }
        this.modalService.hide()
        this.rawPassword = result.password;
        this.openShowPasswordTooltip(this.rawPassword, this.rawPasswordIndex);
      }
      else {
        this.toastr.error(result.msg, '', {
          timeOut: 10000,
        });
      }
    })
  }

  objectsAreSame(x, y) {
    let differentValueObject = {}
    let objectsAreSame = true;
    for (let propertyName in x) {
      if (x[propertyName] !== y[propertyName]) {
        objectsAreSame = false;
        differentValueObject[propertyName] = x[propertyName]
      }
    }
    return {
      'objectsAreSame': objectsAreSame,
      'differentValueObject': differentValueObject
    };
  }

  applyValidatorsForMaxStack(index) {
    if (this.sportSettingParentValidation) {
      this.sportsSettingsFormArr.controls[index]['controls'].market_max_stack.setValidators([ValidatorControls.requiredValidator("Market Max Stack is required"), ValidatorControls.minValueValidator(this.sportsSettingsFormArr.controls[index]['controls'].market_min_stack.value, true, "Market Max Stack value should not be less than Market Min Stack", false), ValidatorControls.maxValueValidator(this.specificUserParentDetails[index].market_max_stack, true, "Market Max Stack value should not be greater than parent value")])
    } else {
      this.sportsSettingsFormArr.controls[index]['controls'].market_max_stack.setValidators([ValidatorControls.requiredValidator("Market Max Stack is required"), ValidatorControls.minValueValidator(this.sportsSettingsFormArr.controls[index]['controls'].market_min_stack.value, true, "Market Max Stack value should not be less than Market Min Stack", false), ValidatorControls.maxValueValidator(this.specificUserParentDetails[index].market_max_stack_max_limit, true, "Max. Stake Amount value should not be greater than " + this.specificUserParentDetails[index].market_max_stack_max_limit)])
    }
    this.sportsSettingsFormArr.controls[index]['controls'].market_max_stack.updateValueAndValidity();

  }

  applyValidatorsForMaxOddsRate(index) {
    if (this.sportSettingParentValidation) {
      this.sportsSettingsFormArr.controls[index]['controls'].market_max_odds_rate.setValidators([ValidatorControls.requiredValidator("Market Max odds rate is required"), ValidatorControls.minValueValidator(this.sportsSettingsFormArr.controls[index]['controls'].market_min_odds_rate.value, true, "Market Max odds rate value should not be less than Market Min odds rate", false), ValidatorControls.maxValueValidator(this.specificUserParentDetails[index].market_max_odds_rate, true, "Market Max odds rate value should not be greater than parent value")])
    } else {
      this.sportsSettingsFormArr.controls[index]['controls'].market_max_odds_rate.setValidators([ValidatorControls.requiredValidator("Market Max odds rate is required"), ValidatorControls.minValueValidator(this.sportsSettingsFormArr.controls[index]['controls'].market_min_odds_rate.value, true, "Market Max odds rate value should not be less than Market Min odds rate", false), ValidatorControls.maxValueValidator(this.specificUserParentDetails[index].market_max_odds_rate, true, "Market Max odds rate value should not be greater than " + this.specificUserParentDetails[index].market_max_odds_rate)])
    }
    this.sportsSettingsFormArr.controls[index]['controls'].market_max_odds_rate.updateValueAndValidity();

  }

  applyValidatorsForMaxstake(index) {
    if (this.sportSettingParentValidation) {
      this.sportsSettingsFormArr.controls[index]['controls'].session_max_stack.setValidators([ValidatorControls.requiredValidator("Max. Stake Amount is required"), ValidatorControls.minValueValidator(this.sportsSettingsFormArr.controls[index]['controls'].session_min_stack.value, true, "Max. Stake Amount value should not be less than min Stake Amount value", false), ValidatorControls.maxValueValidator(this.specificUserParentDetails[index].session_max_stack, true, "Max. Stake Amount value should not be greater than parent value")])
    } else {
      this.sportsSettingsFormArr.controls[index]['controls'].session_max_stack.setValidators([ValidatorControls.requiredValidator("Max. Stake Amount is required"), ValidatorControls.minValueValidator(this.sportsSettingsFormArr.controls[index]['controls'].session_min_stack.value, true, "Max. Stake Amount value should not be less than min Stake Amount value", false), ValidatorControls.maxValueValidator(this.specificUserParentDetails[index].session_max_stack_max_limit, true, "Max. Stake Amount value should not be greater than " + this.specificUserParentDetails[index].session_max_stack_max_limit)])
    }
    this.sportsSettingsFormArr.controls[index]['controls'].session_max_stack.updateValueAndValidity();
  }

  parentValidationToggle(user, index) {
    let message = "Are you sure you want to change the Sports Settings!"
    Swal.fire({
      title: 'Are you sure?',
      text: message,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.isConfirmed) {
        let request = {
          "user_id": user._id,
          "check_event_limit": !user.check_event_limit
        }
        this.usersService.eventCheckApi(request).subscribe(response => {
          this.toastr.success(response.msg, '', {
            positionClass: 'toast-bottom-right',
            timeOut: 1000
          });
          user.check_event_limit = !user.check_event_limit
          this.sportsForm.get('sports_settings')['controls'] = []
          this.createSportsSettingArray(user)

        })
      }

    })
  }

  openModalExposure(user_id, exposure: TemplateRef<any>) {
    this.modalRef = this.modalService.show(
      exposure,
      Object.assign({}, { class: 'resetPwd-modal modal-lg' })
    );
    let data = {
      "user_id": user_id
    }
    this.sport.getExposure(data).subscribe((res) => {
      if (res.status == true) {
        this.exposureData = res.data;
        this.expoLength = this.exposureData.length;
        this.expo_User_name = res.user_name;
      } else {
        this.toastr.error(res.msg, '', {
          timeOut: 10000,
        })
      }


    })
  }

  filterList(parameter, sortOrder) {
    if (parameter == 'user_name') {
      this.assendingUsername = !this.assendingUsername
      if (sortOrder == 'asc') {
        this.userList = this.userList.sort((a, b) => a[parameter].localeCompare(b[parameter]));
      } else if (sortOrder == 'desc') {
        this.userList = this.userList.sort((a, b) => b[parameter].localeCompare(a[parameter]));
      }
    } else {
      if (parameter == 'balance') {
        this.assendingbalance = !this.assendingbalance
      }
      if (parameter == 'point') {
        this.assendingpoint = !this.assendingpoint
      }
      this.assendingCL = !this.assendingCL
      if (sortOrder == 'asc') {
        this.userList = this.userList.sort((a, b) => a[parameter] - b[parameter]);
      } else if (sortOrder == 'desc') {
        this.userList = this.userList.sort((a, b) => b[parameter] - a[parameter]);
      }
    }
  }

  getUserCommission(user_id) {
    this.user_id = user_id
    let request = {
      user_id: user_id
    }
    this.usersService.getUserCommission(request).subscribe(response => {
      this.UserCommissinSettings = response.data
      this.marketCommission = response.data.match_commission
      this.sessionCommission = response.data.session_commission
    })
  }

  updateUserCommission() {
    if (this.UserCommissinSettings.match_commission != this.marketCommission || this.UserCommissinSettings.session_commission != this.sessionCommission) {

      let request = {
        user_id: this.user_id,
        match_commission: this.marketCommission,
        session_commission: this.sessionCommission
      }
      this.usersService.updateUserCommission(request).subscribe(response => {
        this.modalRef.hide();
        this.toastr.success(response.msg, '', {
          positionClass: 'toast-bottom-right',
          timeOut: 1000
        });
      })
    } else {
      this.toastr.error("No changes are found", '', {
        timeOut: 10000,
      })
    }

  }
  openModalUserParentList(user, userParentList: TemplateRef<any>) {
    this.modalRef = this.modalService.show(
      userParentList,
      Object.assign({}, { class: 'modal-lg' })
    );
    this.userParentName = user.user_name;
    let data = {
      "user_id": user._id
    }
    this.sport.showParentList(data).subscribe((res) => {
      if (res.status == true) {
        this.parentList = res.data.agents;
      } else {
        this.toastr.error(res.msg, '', {
          timeOut: 10000,
        })
      }
    })
  }
  copyContent(text) {
    this.objectId = text;
    this.clipboardService.copyFromContent(text)
  }
  contentCopied(e) {
    this.displayTooltip = true;
    this.contenCopied = e.isSuccess;
    setTimeout(() => {
      this.closetooltipDiv()
    }, 1000);
  }
  closetooltipDiv() {
    this.displayTooltip = false;
  }
  userSettlement(userId, fromIndex?: any) {
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
        if (userId == '') {
          this.plusData = res.data.plusData;
          this.plusData = this.plusData.map(v => ({ ...v, type: 1 }))
          this.minusData = res.data.minusData;
          this.minusData = this.minusData.map(v => ({ ...v, type: 2 }))
          Array.prototype.push.apply(this.plusData, this.minusData);
          this.plusData = this.plusData.filter(t => t.description != "Own")
        }
      } else {
        this.plusData = undefined;
      }
    })

  }
  getUserBalance() {
    this.user_id = localStorage.getItem('userId');
    let data = {
      user_id: this.user_id
    }
      this.usersService.getAgentUserBalance(data).subscribe(response => {
        if (response.status == true) {
          this.walletBalance = response.data;
        } else {
          this.cookie.delete('userId');
          this.cookie.delete('is_socket');
          this.cookie.delete('transaction-password');
          this.cookie.delete('transaction_password_timeout')
          localStorage.removeItem("adminDetails");
          this.loginService.clearLocalStorage()
          this.router.navigate(['login'])
          window.location.replace('login');
        }
        this.cdref.detectChanges();
      }, (err) => {
        // this.scoreApi();
      }, () => {
        if (this.router.url.split('?')[0] != '/login') {
          // this.balTimer = setTimeout(() => resolve(this.getUserBalance()), 15000);
        }
      })
  }

  createUserForm() {
    this.addUserFrom = this.fb.group({
      parent_user_name: ['', Validators.required],
      domain: ['', Validators.required],
      domain_name: [''],
      name: ['', Validators.required],
      user_name: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(8), Validators.pattern('')]],
      user_type_id: [1],
      parent_id: [null],
      create_no_of_child: [0],
      child_level: [1],
      point: [1, Validators.required],
      exposure_limit: [-1, Validators.required],
      match_commission: [0, Validators.required],
      session_commission: [0, Validators.required],
      sports_permission: [],
      sports_share: [],
      parent_level_ids: [],
      mobile: ['', Validators.required],
      match_stack: [],
      credit_reference:[null, Validators.required],
    });
    this.applyValidationToFormGroup(this.addUserFrom, "AddUser")
  }

  isControlIsValid(controlName: string): boolean{
    if(this.addUserFrom.controls[controlName].invalid && (this.isAddUserFromSubmitted || this.addUserFrom.controls[controlName].dirty || this.addUserFrom.controls[controlName].touched)){
      return true;
    }
    return false;
  }
  isControlHasErros(controlName: string): ValidationErrors{
    if(this.addUserFrom.controls[controlName].errors){
      return this.addUserFrom.controls[controlName].errors
    }
    return null;
  }


  selectedDomain(event) {
    if (event.domain_name) {
      this.addUserFrom.controls.domain_name.setValue(event.domain_name)
    }
  }

  get f() { return this.addUserFrom.controls; }
  getLoginUseretails() {
    let userData = JSON.parse(localStorage.getItem('adminDetails'))
    this.params = {
      "user_id": userData.user_id,
      "user_type_id": userData.user_type_id
    }
    this.usersService.getLoginUseretails(this.params).subscribe(response => {
      this.userDetail = response.data;
      this.addUserFrom.controls['parent_user_name'].setValue(this.userDetail?.user_name);
      this.addUserFrom.controls['parent_id'].setValue(this.userDetail?._id);
      this.addUserFrom.controls['point'].setValue(this.userDetail?.point);
      this.addUserFrom.controls['match_stack'].setValue(this.userDetail?.match_stack);
      this.loggedInUserTypeId = this.userDetail?.user_type_id;
      if (this.loggedInUserTypeId == 0) {

        this.websiteList = this.userDetail.domain;
      }
      this.userSportPartnerShip = this.userDetail.sports_share;
      if (this.router.url != '/update-user/' + this.user_id) {
        this.addSportsInfo();
      }
      if (this.userDetail.user_type_id != 0) {
        this.parentLevelIds = this.userDetail.parent_level_ids.filter(data => data.user_id != null);
      }
      this.parentLevelIds.push({
        user_id: this.userDetail._id, user_type_id: this.loggedInUserTypeId
        , user_name: this.userDetail.user_name, name: this.userDetail.name
      });
      this.addUserFrom.controls['domain'].setValue(this.userDetail.domain._id);
      this.addUserFrom.controls['match_commission'].setValue(this.userDetail.match_commission);
      this.addUserFrom.controls['session_commission'].setValue(this.userDetail.match_commission);
      this.addUserFrom.controls['domain'].setValue(this.userDetail.domain._id);
      if (this.userDetail.user_type_id != 0) {
        this.addUserFrom.controls.domain_name.setValue(this.userDetail.domain_name)
        this.addUserFrom.controls['match_commission'].setValue(this.userDetail.match_commission);
        this.addUserFrom.controls['session_commission'].setValue(this.userDetail.match_commission);
      }
      this.addUserFrom.controls['session_commission'].setValidators([ValidatorControls.requiredValidator('Session Commission'), ValidatorControls.minValueValidator(this.userDetail.match_commission, true, ("The session commision minimum value should be " + this.userDetail.match_commission))])
      this.addUserFrom.controls['session_commission'].updateValueAndValidity()
      if (this.loggedInUserTypeId != 1) {
        for (let j = this.loggedInUserTypeId - 1; j >= 1; j--) {
          this.levels.push({ 'level': j })
        }
      }
      // Set Sports
      this.userPermissionsList = this.userDetail.sports_permission;
      for (var i = 0; i < this.userPermissionsList.length; i++) {
        this.permissions.push({
          name: this.userPermissionsList[i].name,
          is_allow: this.userPermissionsList[i].is_allow,
          sport: this.userPermissionsList[i].sport,
          sport_id: this.userPermissionsList[i].sport_id
        })
      }
    }, error => {
      console.log(error)
    })
  }
  addSportsInfo() {
    for (var i = 0; i < this.userSportPartnerShip.length; i++) {
      this.addedSportShareList.push({ sport: this.userSportPartnerShip[i].sport, sport_id: (this.userSportPartnerShip[i].sport_id).toString(), name: this.userSportPartnerShip[i].name, percentage: [] });
      for (var j = 0; j <= this.userSportPartnerShip[i].percentage.length; j++) {
        if (j < this.userSportPartnerShip[i].percentage.length) {
          var percentage = this.userSportPartnerShip[i].percentage[j];
          delete percentage._id;
          this.addedSportShareList[i].percentage.push(percentage);
        }
      }
    }
  }
  setUserTypeName(typeName) {
    this.addUserFrom.controls['user_type_id'].setValue(1);
  }

  checkedPermissions(event, index) {
    this.permissions[index].is_allow = event.target.checked;
  }
  checkUserName(username) {
    var obj: any = {};
    obj.user_name = username;
    this.usersService.checkUserName(obj).subscribe((result) => {
      if (result.msg != 'Username is already exists. ') {
        this.isUserNameExist = false;

        this.addUserFrom.controls['user_name'].setErrors({ duplicateCheck: null });
        this.addUserFrom.controls['user_name'].updateValueAndValidity();
        //this.fb.group({ username: ['', Validators.required] })
      } else {
        this.isUserNameExist = true;
        this.addUserFrom.controls['user_name'].setValidators([ValidatorControls.duplicateCheck(this.addUserFrom.controls['user_name'].value, 'user name already exist'), ValidatorControls.requiredValidator('user name is required'), ValidatorControls.cannotContainSpace('Invalid Username'), ValidatorControls.minLengthValidator(3, 'Username should be minimum 3 characters')]);
        this.addUserFrom.controls['user_name'].updateValueAndValidity();
        // this.fb.group({ username: ['', Validators.required] })
      }
    }, (err) => {
      console.log(err);
    });
  }
  addUserData() {
    this.isAddUserFromSubmitted = true;
    this.appValidationService.markFormGroupTouched(this.addUserFrom)
    if (this.addUserFrom.invalid) {
      this.toastr.error("Please fill all mandetory fields", '', {
        timeOut: 10000,
      });
      return
    }
    else {
      this.addUserFrom.controls['parent_level_ids'].setValue(this.parentLevelIds);
      this.addUserFrom.controls['sports_share'].setValue(this.addedSportShareList);
      this.addUserFrom.controls['sports_permission'].setValue(this.permissions);
      if (this.addUserFrom.invalid || this.isUserNameExist) {
        return
      }
      this.addUserFrom.value.sports_permission = this.addUserFrom.value.sports_permission.filter(t => t.is_allow == true);
      this.addUserFrom.controls['session_commission'].setValue(this.addUserFrom.value.match_commission);
      for (let i = this.addUserFrom.value['sports_share'].length; i > 0; i--) {
        if (this.addUserFrom.value['sports_share'][this.addUserFrom.value['sports_share'].length - 1].percentage == '' ||
          this.addUserFrom.value['sports_share'][this.addUserFrom.value['sports_share'].length - 1].percentage == undefined ||
          this.addUserFrom.value['sports_share'][this.addUserFrom.value['sports_share'].length - 1].percentage == null) {
          delete this.addUserFrom.value['sports_share'][this.addUserFrom.value['sports_share'].length - 1].percentage
        } else {
          break;
        }
      }
      delete this.addUserFrom.value['child_level'];
      delete this.addUserFrom.value['parent_user_name'];
      delete this.addUserFrom.value['create_no_of_child'];
      delete this.addUserFrom.value['parent_level_ids'];
      delete this.addUserFrom.value['match_stack'];
      this.usersService.addUser(this.addUserFrom.value).subscribe((result) => {
        this.isAddUserFromSubmitted = false;
        if (result.status == true) {
          this.toastr.success(result.msg, '', {
            positionClass: 'toast-bottom-right',
            timeOut: 1000
          });
          this.addedSportShareList = [];
          this.modalRef.hide();
          this.getUserChildDetail(this.user_id, true);
          // this.router.navigate(['user'])
        } else {
          this.toastr.error(result.msg, '', {
            timeOut: 10000,
          });
        }
      }, (err) => {
        console.log(err);
      });
    }
  }

  account(user) {
    this.router.navigate(['account-info/' + user._id + '/' + user.user_type_id])
  }
  openBet(id, type) {
    this.router.navigate(['open-bet/' + id + '/' + type])
  }
  proloss(id, type) {
    this.router.navigate(['profit-loss/' + id + '/' + type])
  }

  // Only Integer Numbers
  keyPressNumbers(event) {
    var charCode = (event.which) ? event.which : event.keyCode;
    // Only Numbers 0-9
    if ((charCode < 48 || charCode > 57)) {
      event.preventDefault();
      return false;
    } else {
      return true;
    }
  }

}
