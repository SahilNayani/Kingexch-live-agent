import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Router, ActivatedRoute } from "@angular/router";
import { Location } from '@angular/common';
import { UsersService } from '../services/users.service';
import { ToastrService } from 'ngx-toastr';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-account-info',
  templateUrl: './account-info.component.html',
  styleUrls: ['./account-info.component.scss']
})
export class AccountInfoComponent implements OnInit {
  modalRef: BsModalRef;
  resetPasswordForm: FormGroup;
  params: any
  userDetail: any;
  user_id: any;
  user_type_id: any;
  marketCommission: any;
  public showPassword: boolean = false;
  userParentData: any;
  data: any;
  updatedMobile: any;
  updatedRate: any;
  updateExposureLimit: any;
  adminDetails: any;
  currentUser: any;
  currentId: any;
  constructor(private usersService: UsersService, private locationBack: Location, private fb: FormBuilder,
    private router: Router, private route: ActivatedRoute, private toastr: ToastrService,
    private modalService: BsModalService) {
    this.route.params.subscribe(params => {
      this.user_id = params.userid;
      this.user_type_id = params.userTypeId;
    });
  }

  ngOnInit(): void {
    this.adminDetails = JSON.parse(localStorage.getItem('adminDetails'));
    this.getLoginUseretails();
    this.resetPasswordForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(6)]]
    })
  }
  changeChildPwd() {
    if (this.resetPasswordForm.invalid) {
      return
    }
    if (this.adminDetails.user_id == this.userDetail._id) {
      this.data = {
        "newPassword": this.resetPasswordForm.controls.password.value
      }
    } else {
      this.data = {
        "user_id": this.userDetail._id,
        "newPassword": this.resetPasswordForm.controls.password.value
      }
    }
    this.usersService.updatePassword(this.data).subscribe(data => {
      if (data.status == true) {
        this.userParentData = data.data;
        this.getLoginUseretails();
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
  goToBack() {
    this.locationBack.back();
  }

  openModalUserPwd(userPwd: TemplateRef<any>) {
    this.modalRef = this.modalService.show(
      userPwd,
      Object.assign({}, { class: 'userPwd-modal' })
    );
  }

  openModalComissionSetting(comissionSetting: TemplateRef<any>) {
    this.modalRef = this.modalService.show(
      comissionSetting,
      Object.assign({}, { class: 'comissionSetting-modal' })
    );
  }

  openModalRollingCommission(agentRollingCommission: TemplateRef<any>) {
    this.modalRef = this.modalService.show(
      agentRollingCommission,
      Object.assign({}, { class: 'agentRollingCommission-modal' })
    );
  }

  openModalAgentRollingCommission(rollingCommission: TemplateRef<any>) {
    this.modalRef = this.modalService.show(
      rollingCommission,
      Object.assign({}, { class: 'rollingCommission-modal' })
    );
  }

  openModalMobileNumber(mobileNumber: TemplateRef<any>) {
    this.modalRef = this.modalService.show(
      mobileNumber,
      Object.assign({}, { class: 'mobileNumber-modal ' })
    );
  }

  openModalExposureLimit(exposureLimit: TemplateRef<any>) {
    this.modalRef = this.modalService.show(
      exposureLimit,
      Object.assign({}, { class: 'exposureLimit-modal ' })
    );
  }
  getLoginUseretails() {
    this.params = {
      "user_id": this.user_id,
      "user_type_id": this.user_type_id
    }
    this.usersService.getLoginUseretails(this.params).subscribe(response => {
      this.userDetail = response.data;
      this.currentId = this.userDetail?._id;
      this.currentUser = this.userDetail?.parent_level_ids[this.userDetail.parent_level_ids.length - 1]?.user_id;
    }, error => {
      console.log(error)
    })
  }

  updateUserCommission() {
    let request = {
      user_id: this.user_id,
      match_commission: this.marketCommission,
      session_commission: this.marketCommission
    }
    this.usersService.updateUserCommission(request).subscribe(response => {
      this.modalRef.hide();
      this.toastr.success(response.msg, '', {
        positionClass: 'toast-bottom-right',
        timeOut: 1000
      });
      this.getLoginUseretails();
    })


  }

  upMobile() {
    let data = {
      "filter": {
        "user_id": this.user_id
      },
      "update": {
        "mobile": this.updatedMobile
      }
    }
    this.usersService.updateCreditReference(data).subscribe((res) => {
      if (res.status == true) {
        this.toastr.success(res.msg);
        this.modalRef.hide();
        this.getLoginUseretails()
      }
    })
  }
  openModalRateModal(rateModal: TemplateRef<any>,) {
    this.modalRef = this.modalService.show(
      rateModal,
      Object.assign({}, { class: 'rateModal-modal ' })
    );
  }
  upRate() {
    let data = {
      "filter": {
        "user_id": this.user_id
      },
      "update": {
        "partnership": this.updatedRate
      }
    }
    this.usersService.updateCreditReference(data).subscribe((res) => {
      if (res.status == true) {
        this.toastr.success(res.msg);
        this.modalRef.hide();
        this.getLoginUseretails()
      }
    })
  }
  updateExpoLimit() {
    let data = {
      "filter": {
        "user_id": this.user_id
      },
      "update": {
        "exposure_limit": this.updateExposureLimit
      }
    }
    this.usersService.updateCreditReference(data).subscribe((res) => {
      if (res.status == true) {
        this.toastr.success(res.msg);
        this.modalRef.hide();
        this.getLoginUseretails()
      }
    })
  }

  statement(id, type) {
    this.router.navigate(['statement/' + id + '/' + type])
  }
  account(id, type) {
    this.router.navigate(['account-info/' + id + '/' + type])
  }
  openBet(id, type) {
    this.router.navigate(['open-bet/' + id + '/' + type])
  }
  proloss(id, type) {
    this.router.navigate(['profit-loss/' + id + '/' + type])
  }
  onlineUser(id, type) {
    this.router.navigate(['online-user/' + id + '/' + type])
  }
}
