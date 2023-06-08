import { Component, OnInit, TemplateRef, ElementRef,ChangeDetectorRef, ViewChild, Output, EventEmitter } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { UsersService } from '../services/users.service';
import { CookieService } from 'ngx-cookie-service';
import { FormArray, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { SportService } from '../services/sport.service';
import { ReportService } from '../services/report.service';
import { AddAgentService } from '../add-agent/add-agent.service'
import Swal from 'sweetalert2'
import { json } from 'express';
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
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss'],
  providers: [ExcelServiceService]
})
export class AddUserComponent implements OnInit {
  @ViewChild('t1', { static: false }) userNametooltip: NgbTooltip;
  public Base_Url = environment['adminServerUrl'];
  @Output() notify = new EventEmitter<any>();
  modalRef: BsModalRef;
  changePasswordForm: FormGroup;
  addAgentFrom: FormGroup;
  isAddAgentFromSubmitted = false;
  userList = [];
  user_id: any;
  submitted = false;
  selectedUserId;
  levelParentUserId: string = null;
  adminDetails;
  currentPage: number = 1;
  itemsPerPage: number = 10;
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
    parent_id: null,
    parent_partnership_share: 0,
    user_share: 0,
    share: 0,
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
  param: any
  domainName: any;
  loggedInUserTypeId: any;
  userSportPartnerShip: any;
  parentCommission = [];
  shareMessageValidation: Array<boolean> = []
  sportIndexForMessage = 25;
  tempSportPartnership = [];
  parentLevelIds = [];
  levels = [];
  permissions = [];
  refaddedSportShareList = [];
  isUserNameExist: boolean;
  showPS: boolean;
  updatedRate: any;
  cRefrence: any;
  type: any;
  currentUserTypeId: any;
  paidtoData: any;
  recedData: any;
  hierarchyTypeId: any;
  settling: boolean;
  plusData: any;
  minusData: any;
  settlingAmount: any;
  settlementType: any;
  currentSettlementUserId: any;
  historyCrData: any;
  searchParam: any;
  itemsPP: number = 10;
  currentPageNo: number = 1;
  totalItems: number = 0;
  wallet: any;
  selectedStatus: number = 0;
  breadCrumbs: any;
  currentId: any;

  constructor(private modalService: BsModalService, private sport: SportService, private report: ReportService,
    private previousRouteService: PreviousRouteService, public clipboardService: ClipboardService,private cdRef: ChangeDetectorRef,
    private websiteSettingService: WebsiteSettingService, private addAgentService: AddAgentService,
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
    this.getUserBalance();
    // await this.socketService.setUpSocketConnection();
    this.isSocket = this.cookie.get('is_socket');
    this.isSocket = 0;
    this.getAllwebsite()
    this.depositWithdrawlForm = this.fb.group({
      "accChips": 0,
      "reMark": '',
      "userPass": ''
    });
    this.applyValidationToFormGroup(this.depositWithdrawlForm, "UserDataDepositWithdrawl")
    this.type = (this.loggedInUser.user_type_id);
    this.getUserChildDetail(this.user_id, true)
    // this.userSettlement('')
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
  getUserBalance() {
    this.user_id = localStorage.getItem('userId');
    let data = {
      user_id: this.user_id
    }
    this.usersService.getAgentUserBalance(data).subscribe(response => {
      if (response.status == true) {
        this.wallet = response.data;
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
      // this.cdRef.detectChanges();
    }, (err) => {
      // this.scoreApi();
    }, () => {
      if (this.router.url.split('?')[0] != '/login') {
        // this.balTimer = setTimeout(() => resolve(this.getUserBalance()), 15000);
      }
    })


  }
  goToBack() {
    this.locationBack.back();
  }

  addUser(userid, typeid) {
    sessionStorage.setItem("hierarchy", JSON.stringify(this.hierarchy))
    this.router.navigate(['addChild-user/' + userid + '/' + typeid])
  }

  downlineList(user) {
    sessionStorage.setItem("hierarchy", JSON.stringify(this.hierarchy))
    this.router.navigate(['downline-report/' + user._id + '/' + user.user_type_id], { queryParams: { netExposure: JSON.stringify(user.liability), balance: JSON.stringify(user.balance), profit_loss: JSON.stringify(user.profit_loss) } })
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
      Object.assign({}, { class: 'deposite-modal' })
    );
  }

  openModalDeleteList(deleteList: TemplateRef<any>, user) {
    this.selectedUserId = user._id;
    this.selectedUser = user;
    this.modalRef = this.modalService.show(
      deleteList,
      Object.assign({}, { class: 'userPwd-modal' })
    );
  }
  openModalChangeStatus(changeStatus: TemplateRef<any>, user) {
    this.selectedUserId = user._id;
    console.log("560",user);
    
    this.selectedUser = user;
    this.selectedStatus = 0;
    this.modalRef = this.modalService.show(
      changeStatus,
      Object.assign({}, { class: 'userPwd-modal' })
    );
  }
  openModalRateModal(rateModal: TemplateRef<any>, user) {
    this.selectedUser = user;
    this.modalRef = this.modalService.show(
      rateModal,
      Object.assign({}, { class: 'rateModal-modal' })
    );
  }
  openModalCreditRefModal(creditRefModal: TemplateRef<any>, user) {
    this.selectedUser = user;
    this.modalRef = this.modalService.show(
      creditRefModal,
      Object.assign({}, { class: 'creditRefModal-modal' })
    );
  }
  openModalAddClient(addClient: TemplateRef<any>) {
    this.addedSportShareList = [];
    this.modalRef = this.modalService.show(
      addClient,
      Object.assign({}, { class: 'add-user' })
    );
    this.getLoginUseretails();
    this.createAgentFrom();
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
      Object.assign({}, { class: 'userPwd-modal modal-lg' })
    );
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
        if (this.depositWithdrawlForm.controls.reMark.value != null) {
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
              let param = {};
              this.usersService.getUserBalance(param).subscribe(response => {
                this.walletBalance = response.data;
                //this.cdRef.detectChanges();
              })
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
          timeOut: 10000,
        });
      }
    } else {
      this.toastr.error("please enter Amount", '', {
        timeOut: 10000,
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
  }// hierarchy =[]
  getUserChildDetail(id, disableHierarchyadding?: boolean) {
    this.currentId = id
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
      // this.currentPage = 1
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
    if (this.isSocket != 1) {
      this.usersService.getChildList(this.usersListReqPageQuery).subscribe(data => {
        if (data.status == true) {
          this.addUserId = id;
          this.userList = data.data;
          this.breadCrumbs = data.breadcrumbs;
          if(this.userList.length != 0){
            this.total_items = data.metadata.total;
          }
          this.cdRef.detectChanges()
          // if (this.settling == true) {
          //   this.paidtoData = this.paidtoData.filter(t => t.user_type_id == (this.adminDetails.user_type_id - 1))
          //   let a3 = this.userList.map(t1 => ({ ...t1, ...this.paidtoData.find(t2 => (t2.user_id === t1._id)) }));
          //   this.userList = a3;
          // } 
          // if(this.itemsPerPage > data.total){
          //   this.itemsPerPage = 1
          //   this.pageChange(this.itemsPerPage)
          // }
          this.currentUserTypeId = id;
          // if (this.searchQuery == '' || this.searchQuery == undefined || this.searchQuery == null) {
          //   this.userList = this.userList.filter(t => t.user_type_id != 1)
          // }
          // this.expoTotal = this.userList.reduce(
          //   (a: number, b) => a + b.exposure, 0);
          // this.plTotal = this.userList.reduce(
          //   (a: number, b) => a + b.profit_loss, 0);
          // this.balTotal = this.userList.reduce(
          //   (a: number, b) => a + b.balance, 0);
          this.adminDetails = data.data;
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

      }, error => {
        console.log(error)
      })
    }
    else {
      this.usersListReqPageQuery["user_id"] = id;
      // this.socketEmitEvent('get-user-details-with-child-level-details',
      //   this.usersListReqPageQuery
      // );
    }
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
    this.hierarchyTypeId = type
    // this.userSettlement(id,fromIndex);
  }

  getSubUserChild(id, type, fromIndex?: any) {
    if (this.isSocket != 1) {
      this.usersListReqPageQuery = {
        user_id: id,
        page: this.currentPage,
        limit: this.itemsPerPage,
        user_name: this.searchQuery,
        // user_type_id: this.type,
      };
      this.currentId = id
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
        // this.currentPage = 1
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
      // if(this.loggedInUser.user_type_id == type){
      //   delete  this.usersListReqPageQuery.included_users
      // } else {
      //   this.usersListReqPageQuery.included_users = true
      // }
      this.usersService.getChildList(this.usersListReqPageQuery).subscribe(data => {
        if (this.loggedInUser.user_type_id == data.data.user_type_id) {
          this.getUserChildDetail(this.user_id, true)
        } else {
          this.currentUserTypeId = id;
          if (fromIndex != "onclickusername" && fromIndex != null) {
            let length = this.hierarchy.length
            this.hierarchy.splice(fromIndex, length - fromIndex);
          } else if (fromIndex != null) {
            this.hierarchy.push({ "page": this.currentPage, 'userId': data.data._id, 'user_name': data.data.user_name, 'user_type_id': data.data.user_type_id });
          }
          this.userList = data.data;
          this.breadCrumbs = data.breadcrumbs;
          if(this.userList.length != 0){
            this.total_items = data.metadata.total;
          }
          if (this.settling == true) {
            let a3 = this.userList.map(t1 => ({ ...t1, ...this.paidtoData.find(t2 => (t2.user_id === t1._id)) }));
            this.userList = a3;
            // this.plusData = this.plusData.filter(t => t.description != "Own")
          }
          this.expoTotal = this.userList.reduce(
            (a: number, b) => a + b.exposure, 0);
          this.plTotal = this.userList.reduce(
            (a: number, b) => a + b.profit_loss, 0);
          this.balTotal = this.userList.reduce(
            (a: number, b) => a + b.balance, 0);
          this.addUserId = id;
          this.addUserTypeId = type;
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

  pageChange(newPage: any) {
    // if (this.levelParentUserId != null && this.levelParentUserId != undefined) {
    //   console.log("1076")
    //   this.getSubUserChild(this.levelParentUserId, null);
    // }
    // else {
    //   console.log("1080")
    //   this.getUserChildDetail(this.user_id, false);
    // }
    this.currentPage = newPage;
    this.usersListReqPageQuery = {
      page: this.currentPage,
      limit: this.itemsPerPage,
      searchQuery: this.searchQuery
    }; 
    this.getUserChildDetail(this.currentId, false);
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
          }
        });
      }

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
      var message = '';
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
      alert("First Clear Exposure , Balance & Settlement amount. After then you will close A/C successfully....");
      this.getUserChildDetail(this.user_id, false);
      this.modalRef.hide();
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

  exposure(user) {
    let data = {
      "user_id": user.user_id
    }
    this.sport.getExposure(data).subscribe((res) => {
      if (res.status == true) {
        this.exposureData = res.data;
        this.expoLength = this.exposureData.length;
        user.exposure= (this.exposureData[this.expoLength-1].liabilitySum).toFixed(2);
        this.cdRef.detectChanges();
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
  deposit(id, parentId, crdr) {
    if (this.depositWithdrawlForm.controls.accChips.value) {
      if (this.depositWithdrawlForm.controls.userPass.value) {
        if (this.depositWithdrawlForm.controls.reMark.value != null) {
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
              let param = {}
              this.usersService.getUserBalance(param).subscribe(response => {
                this.walletBalance = response.data;
                //this.cdRef.detectChanges();
              })
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
  openModalExposureLimit(exposureLimit: TemplateRef<any>) {
    this.modalRef = this.modalService.show(
      exposureLimit,
      Object.assign({}, { class: 'exposureLimit-modal modal-lg' })
    );
  }
  getLoginUseretails() {
    let userData = JSON.parse(localStorage.getItem('adminDetails'))
    this.param = {
      "user_id": userData.user_id,
      "user_type_id": userData.user_type_id
    }
    this.usersService.getLoginUseretails(this.param).subscribe(response => {
      this.userDetail = response.data;
      this.domainName = this.userDetail.domain.host_name;
      this.loggedInUserTypeId = this.userDetail.user_type_id;
      this.userSportPartnerShip = this.userDetail.sports_share;
      this.userSportPartnerShip.forEach((element, index) => {
        this.shareMessageValidation.push(null)
        this.userSportPartnerShip[index].percentage.forEach((element, index2) => {
          this.userSportPartnerShip[index].percentage[index2].user_share = 0
        });
      });
      this.tempSportPartnership = this.userDetail.sports_share;
      this.addSportsInfo();
      this.addAgentFrom.controls['parent_user_name'].setValue(this.userDetail.user_name);
      this.addAgentFrom.controls['parent_id'].setValue(this.userDetail._id);
      this.addAgentFrom.controls['point'].setValue(this.userDetail.point);
      this.addAgentFrom.controls['match_stack'].setValue(this.userDetail.match_stack);

      if (this.userDetail.user_type_id != 0) {
        this.parentLevelIds = this.userDetail.parent_level_ids.filter(data => data.user_id != null);
      }
      this.parentLevelIds.push({
        user_id: this.userDetail._id, user_type_id: this.loggedInUserTypeId
        , user_name: this.userDetail.user_name, name: this.userDetail.name
      });
      this.permissions = this.userDetail.sports_permission;
      if (this.loggedInUserTypeId != 0) {
        for (let j = this.loggedInUserTypeId - 1; j >= 1; j--) {
          this.levels.push({ 'level': j })
        }
      }
      if (this.loggedInUserTypeId != 0) {
        this.addAgentFrom.controls.domain_name.setValue(this.userDetail.domain_name)
        this.onChangeChildLevel(this.loggedInUserTypeId - 1)
      }
      // Set Sports
      for (var i = 0; i < this.permissions.length; i++) {
        let formArray = this.addAgentFrom.get('sports_permission') as FormArray;
        let group = this.fb.group({
          name: this.permissions[i].name,
          is_allow: this.permissions[i].is_allow,
          sport: this.permissions[i].sport,
          sport_id: this.permissions[i].sport_id
        })
        formArray.push(group)
      }
      this.websiteList = this.userDetail.domain
      this.addAgentFrom.controls['domain'].setValue(this.userDetail.domain._id);
      if (this.userDetail.user_type_id != 0) {
        this.addAgentFrom.controls['match_commission'].setValue(this.userDetail.match_commission);
        this.addAgentFrom.controls['session_commission'].setValue(this.userDetail.match_commission);
        this.addAgentFrom.controls['session_commission'].setValidators([ValidatorControls.minValueValidator(this.userDetail.match_commission, true, ("The session commision minimum value should be " + this.userDetail.match_commission))])
        this.addAgentFrom.controls['session_commission'].updateValueAndValidity()
      }
    }, error => {
      console.log(error)
    })
  }
  createAgentFrom() {
    this.addAgentFrom = this.fb.group({
      parent_user_name: [''],
      domain: ['', Validators.required],
      domain_name: [''],
      name: ['', Validators.required],
      user_name: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.pattern('')]],
      user_type_id: [0],
      parent_id: [null],
      create_no_of_child: [0],
      child_level: [null, Validators.required],
      point: [1, Validators.required],
      exposure_limit: [-1, Validators.required],
      match_commission: [null, Validators.required],
      session_commission: [null, Validators.required],
      sports_permission: this.fb.array([]),
      sports_share: [],
      user_id: null,
      parent_level_ids: [],
      match_stack: [],
      credit_reference: [null],
      partnership: [null],
      mobile: [null]
    })
    this.appValidationService.applyValidationRulesToFromGroup(this.addAgentFrom, "AddAgent").then((validators) => {
    }).catch(() => { })
  }

  isControlIsValid(controlName: string): boolean{
    if(this.addAgentFrom.controls[controlName].invalid && (this.isAddAgentFromSubmitted || this.addAgentFrom.controls[controlName].dirty || this.addAgentFrom.controls[controlName].touched)){
      return true;
    }
    return false;
  }
  isControlHasErros(controlName: string): ValidationErrors{
    if(this.addAgentFrom.controls[controlName].errors){
      return this.addAgentFrom.controls[controlName].errors
    }
    return null;
  }

  checkedPermissions(event, index) {
    let formGroupcontrol = this.addAgentFrom.get('sports_permission')['controls'][index]
    formGroupcontrol.controls.is_allow.value = !formGroupcontrol.controls.is_allow.value
    formGroupcontrol.controls.is_allow.patchValue(formGroupcontrol.controls.is_allow.value)
  }
  get f() { return this.addAgentFrom.controls; }
  onChangeChildLevel(selectedValue) {
    this.addAgentFrom.controls['create_no_of_child'].setValue(selectedValue);
    this.addAgentFrom.controls['child_level'].setValue(selectedValue);
    this.addAgentFrom.controls['user_type_id'].setValue(selectedValue);
  }

  setUserTypeIdAndName(childLevel) {
    this.addAgentFrom.controls['create_no_of_child'].setValue(this.addAgentFrom.controls['child_level'].value);
    this.addAgentFrom.controls['user_type_id'].setValue(this.addAgentFrom.controls['child_level'].value);
  }

  setUserTypeName(typeName) {
    this.addAgentFrom.controls['user_type_id'].setValue(this.addAgentFrom.controls['child_level'].value);
  }
  addSportsInfo() {
    for (var i = 0; i < this.tempSportPartnership.length; i++) {
      this.addedSportShareList.push({ sport: this.tempSportPartnership[i].sport, sport_id: (this.tempSportPartnership[i].sport_id).toString(), name: this.tempSportPartnership[i].name, percentage: [] });
      for (var j = 0; j <= this.tempSportPartnership[i].percentage.length; j++) {
        if (j < this.tempSportPartnership[i].percentage.length) {
          var percentage = this.tempSportPartnership[i].percentage[j];
          delete percentage._id;
          if (j == this.tempSportPartnership[i].percentage.length - 1) {
            percentage.share = 0;
          }
          if (this.userDetail.user_type_id == 0) {
            percentage.parent_share = 100;
          }
          this.addedSportShareList[i].percentage.push(percentage);
        }
        else {
          this.addedSportShareDetails = {
            parent_id: this.tempSportPartnership[i].percentage[this.tempSportPartnership[i].percentage.length - 1].user_id,
            parent_share: this.tempSportPartnership[i].percentage[this.tempSportPartnership[i].percentage.length - 1].parent_share,
            parent_partnership_share: this.tempSportPartnership[i].percentage[this.tempSportPartnership[i].percentage.length - 1].parent_partnership_share,
            user_share: this.tempSportPartnership[i].percentage[this.tempSportPartnership[i].percentage.length - 1].user_share,
            share: this.userSportPartnerShip[i].percentage[this.userSportPartnerShip[i].percentage.length - 1].share,
          }
          // if (this.userDetail.user_type_id != 0) {
          //   this.addedSportShareDetails.parent_share = this.tempSportPartnership[i].percentage[this.tempSportPartnership[i].percentage.length - 1].user_share
          // }
          this.addedSportShareList[i].percentage.push(this.addedSportShareDetails);
        }
      }
    }
  }
  checkUserName(username) {
    var obj: any = {};
    obj.user_name = username;
    this.usersService.checkUserName(obj).subscribe((result) => {
      if (result.msg != 'Username is already exists. ') {
        this.isUserNameExist = false;

        this.addAgentFrom.controls['user_name'].setErrors({ duplicateCheck: null });
        this.addAgentFrom.controls['user_name'].updateValueAndValidity();
        //this.fb.group({ username: ['', Validators.required] })
      } else {
        this.isUserNameExist = true;
        this.addAgentFrom.controls['user_name'].setValidators([ValidatorControls.duplicateCheck(this.addAgentFrom.controls['user_name'].value, 'user name already exist'), ValidatorControls.requiredValidator('user name is required'), ValidatorControls.cannotContainSpace('Invalid Username'), ValidatorControls.minLengthValidator(3, 'Username should be minimum 3 characters ')]);
        this.addAgentFrom.controls['user_name'].updateValueAndValidity();
        // this.fb.group({ username: ['', Validators.required] })
      }
    }, (err) => {
      console.log(err);
    });
  }
  addAgentData() {
    this.isAddAgentFromSubmitted = true;
    this.submitted = true;
    this.appValidationService.markFormGroupTouched(this.addAgentFrom)
    if (this.isUserNameExist) {
      this.userNametooltip.open()
    }
    delete this.addAgentFrom.value['child_level'];
    delete this.addAgentFrom.value['parent_user_name'];
    delete this.addAgentFrom.value['create_no_of_child'];
    delete this.addAgentFrom.value['parent_level_ids'];
    delete this.addAgentFrom.value['match_stack'];
    let userShareDetails = this.userSportPartnerShip.filter(object => object.percentage[object.percentage.length - 1].user_share === null);
    let shareErrors = this.shareMessageValidation.filter(object => object != null)
    if (this.addAgentFrom.invalid || shareErrors.length != 0 || userShareDetails.length != 0 || this.isUserNameExist) {
      this.addedSportShareList = [];
      this.userSportPartnerShip = this.userDetail.sports_share;
      this.userSportPartnerShip.forEach((element, index) => {
        this.shareMessageValidation.push(null)
        this.userSportPartnerShip[index].percentage.forEach((element, index2) => {
          this.userSportPartnerShip[index].percentage[index2].user_share = 0
        });
      });
      this.tempSportPartnership = this.userDetail.sports_share;
      this.addSportsInfo();
      return
    }
    else {
      this.addAgentFrom.controls['parent_level_ids'].setValue(this.parentLevelIds);
      this.refaddedSportShareList = this.addedSportShareList;
      for (let i = 0; i < this.refaddedSportShareList.length; i++) {
        for (let j = 0; j < this.refaddedSportShareList[i].percentage.length; j++) {
          if (j == (this.refaddedSportShareList[i].percentage.length - 1)) {
            this.refaddedSportShareList[i].percentage[j].parent_share = this.refaddedSportShareList[i].percentage[j].user_share;
          }
        }
      }
      this.addAgentFrom.controls['sports_share'].setValue(this.refaddedSportShareList);
      this.addAgentFrom.removeControl('user_id');
      this.addAgentFrom.controls['session_commission'].setValue(this.addAgentFrom.value.match_commission);
      this.addAgentFrom.value.sports_permission = this.addAgentFrom.value.sports_permission.filter(t => t.is_allow == true);
      for (let i = this.addAgentFrom.value['sports_share'].length; i > 0; i--) {
        if (this.addAgentFrom.value['sports_share'][this.addAgentFrom.value['sports_share'].length - 1].percentage == '' ||
          this.addAgentFrom.value['sports_share'][this.addAgentFrom.value['sports_share'].length - 1].percentage == undefined ||
          this.addAgentFrom.value['sports_share'][this.addAgentFrom.value['sports_share'].length - 1].percentage == null) {
          delete this.addAgentFrom.value['sports_share'][this.addAgentFrom.value['sports_share'].length - 1].percentage
        } else {
          break;
        }
      }
      delete this.addAgentFrom.value['child_level'];
      delete this.addAgentFrom.value['parent_user_name'];
      delete this.addAgentFrom.value['create_no_of_child'];
      delete this.addAgentFrom.value['parent_level_ids'];
      delete this.addAgentFrom.value['match_stack'];
      this.addAgentService.addAgent(this.addAgentFrom.value).subscribe((result) => {
        this.isAddAgentFromSubmitted = false;
        if (result.status == true) {
          this.toastr.success(result.msg, '', {
            positionClass: 'toast-bottom-right',
            timeOut: 1000
          });
          this.addedSportShareList = [];
          this.modalRef.hide();
          this.getUserChildDetail(this.user_id, true)
          // this.router.navigateByUrl('user')
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

  selectedDomain(event) {
    if (event.domain_name) {
      this.addAgentFrom.controls.domain_name.setValue(event.domain_name)
    }
  }

  addUserEnteredShareInList(share, sport, index) {
    this.showPS = true;
    if (share == null || share == undefined) {
      share = 0;
    }
    if (share != null || share != undefined) {
      if (share != 0) {
        if (parseInt(share) <= parseInt(this.addedSportShareList[index].percentage[this.addedSportShareList[index].percentage.length - 1].parent_share)) {
          this.shareMessageValidation[index] = null;
          //this.sportIndexForMessage = index;
          this.addedSportShareList[index].percentage[this.addedSportShareList[index].percentage.length - 1].user_share = parseInt(share);
          this.addedSportShareList[index].percentage[this.addedSportShareList[index].percentage.length - 1].share = parseInt(share);
          this.addedSportShareList[index].percentage[this.addedSportShareList[index].percentage.length - 1].parent_partnership_share = parseInt(this.addedSportShareList[index].percentage[this.addedSportShareList[index].percentage.length - 1].parent_share) - parseInt(share);
          this.addedSportShareList[index].percentage[this.addedSportShareList[index].percentage.length - 2].share = parseInt(this.addedSportShareList[index].percentage[this.addedSportShareList[index].percentage.length - 1].parent_share) - parseInt(share);
        }
        else {
          this.shareMessageValidation[index] = true;
          // this.sportIndexForMessage = index;
        }
      } else {
        if (parseInt(share) <= parseInt(this.addedSportShareList[index].percentage[this.addedSportShareList[index].percentage.length - 1].parent_share)) {
          this.shareMessageValidation[index] = null;
          //this.sportIndexForMessage = index;
          this.addedSportShareList[index].percentage[this.addedSportShareList[index].percentage.length - 1].user_share = parseInt(share);
          this.addedSportShareList[index].percentage[this.addedSportShareList[index].percentage.length - 1].share = parseInt(share);
          this.addedSportShareList[index].percentage[this.addedSportShareList[index].percentage.length - 1].parent_partnership_share = 0
          this.addedSportShareList[index].percentage[this.addedSportShareList[index].percentage.length - 2].share = parseInt(this.addedSportShareList[index].percentage[this.addedSportShareList[index].percentage.length - 1].parent_share) - parseInt(share);
        }
        else {
          this.shareMessageValidation[index] = true;
          // this.sportIndexForMessage = index;
        }
      }

    }
  }
  addAgentPartnership() {
    this.showPS = true;
    // if (this.addAgentFrom.value['partnership'] == null || this.addAgentFrom.value['partnership'] == undefined) {
    //   share = 0;
    // }
    this.addAgentFrom.controls['partnership'].setValue(0)
    for(let index = 0 ; index < this.addedSportShareList.length ; index++){
      if (this.addAgentFrom.value['partnership'] != null || this.addAgentFrom.value['partnership'] != undefined) {
        if (this.addAgentFrom.value['partnership'] != 0) {
          if (parseInt(this.addAgentFrom.value['partnership']) <= parseInt(this.addedSportShareList[index].percentage[this.addedSportShareList[index].percentage.length - 1].parent_share)) {
            this.shareMessageValidation[index] = null;
            //this.sportIndexForMessage = index;
            this.addedSportShareList[index].percentage[this.addedSportShareList[index].percentage.length - 1].user_share = parseInt(this.addAgentFrom.value['partnership']);
            this.addedSportShareList[index].percentage[this.addedSportShareList[index].percentage.length - 1].share = parseInt(this.addAgentFrom.value['partnership']);
            this.addedSportShareList[index].percentage[this.addedSportShareList[index].percentage.length - 1].parent_partnership_share = parseInt(this.addedSportShareList[index].percentage[this.addedSportShareList[index].percentage.length - 1].parent_share) - parseInt(this.addAgentFrom.value['partnership']);
            this.addedSportShareList[index].percentage[this.addedSportShareList[index].percentage.length - 2].share = parseInt(this.addedSportShareList[index].percentage[this.addedSportShareList[index].percentage.length - 1].parent_share) - parseInt(this.addAgentFrom.value['partnership']);
          }
          else {
            this.shareMessageValidation[index] = true;
            // this.sportIndexForMessage = index;
          }
        } else {
          if (parseInt(this.addAgentFrom.value['partnership']) <= parseInt(this.addedSportShareList[index].percentage[this.addedSportShareList[index].percentage.length - 1].parent_share)) {
            this.shareMessageValidation[index] = null;
            //this.sportIndexForMessage = index;
            this.addedSportShareList[index].percentage[this.addedSportShareList[index].percentage.length - 1].user_share = parseInt(this.addAgentFrom.value['partnership']);
            this.addedSportShareList[index].percentage[this.addedSportShareList[index].percentage.length - 1].share = parseInt(this.addAgentFrom.value['partnership']);
            this.addedSportShareList[index].percentage[this.addedSportShareList[index].percentage.length - 1].parent_partnership_share = 0
            this.addedSportShareList[index].percentage[this.addedSportShareList[index].percentage.length - 2].share = parseInt(this.addedSportShareList[index].percentage[this.addedSportShareList[index].percentage.length - 1].parent_share) - parseInt(this.addAgentFrom.value['partnership']);
          }
          else {
            this.shareMessageValidation[index] = true;
            // this.sportIndexForMessage = index;
          }
        }
  
      }
    }
    
  }
  account(user) {
    this.router.navigate(['account-info/' + user._id + '/' + user.user_type_id])
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
      } else {
        this.toastr.error(res.msg)
      }
    })
  }
  upRate() {
    let data = {
      "filter": {
        "user_id": this.selectedUser._id
      },
      "update": {
        "partnership": this.updatedRate
      }
    }
    this.usersService.updateCreditReference(data).subscribe((res) => {
      if (res.status == true) {
        this.toastr.success(res.msg);
        this.modalRef.hide();
        this.getUserChildDetail(this.user_id, true)
      } else {
        this.toastr.error(res.msg)
      }
    })
  }
  openModalCR(creditReference: TemplateRef<any>, user) {
    this.selectedUser = user;
    this.modalRef = this.modalService.show(
      creditReference,
      Object.assign({}, { class: 'exposureLimit-modal modal-lg' })
    );
  }
  historyCRefrence() {
    let data = {
      "user_id": this.selectedUser._id,
      "search": this.searchParam,
      // "page": this.currentPageNo,
      // "limit": this.itemsPP,
    }
    if (data.search == undefined || data.search == '') {
      delete data.search
    }
    this.usersService.historyCreditReference(data).subscribe((res) => {
      if (res.status == true) {
        this.historyCrData = res.data;
        // this.totalItems = res.total;
      } else {
        this.toastr.error(res.msg)
      }
    })
  }
  setSelectedPageOption(selectedOption) {
    this.itemsPP = parseInt(selectedOption);
    this.historyCRefrence();
  }
  popupPageChange(newPage: number) {
    this.currentPage = newPage;
    this.historyCRefrence();
  }
  openBet(id, type) {
    this.router.navigate(['open-bet/' + id + '/' + type])
  }
  proloss(id, type) {
    this.router.navigate(['eventpl/' + id ])
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
