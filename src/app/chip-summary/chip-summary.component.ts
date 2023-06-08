import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from "@angular/router";
import { ToastrService } from 'ngx-toastr';
import { Location } from '@angular/common';
import { ReportService } from '../services/report.service';
import { SportService } from '../services/sport.service';
@Component({
  selector: 'app-chip-summary',
  templateUrl: './chip-summary.component.html',
  styleUrls: ['./chip-summary.component.scss']
})
export class ChipSummaryComponent implements OnInit {
  modalRef: BsModalRef;
  settlementData: any;
  paidtoData: any;
  recedData: any;
  plusData: any;
  minusData: any;
  minusLength: any;
  totalPlus: any;
  plusLength: any;
  totalMinus: any;
  parent_user_name: any;
  parent_id: any;
  adminDetails: any;
  callingType: any = 1;
  backShowButton: boolean;
  user_id: any;
  showButton: boolean;
  rightVal: any;
  settleAmt: any;
  settlementForm: FormGroup;
  parentDataId: any;
  settlementHistoryData: any;
  settlementCallingType: any = 1;
  parentId: any;
  userParentName: any;
  parentList: any;
  popUpData: boolean;
  constructor(private sport: SportService,private router: Router,private fb: FormBuilder, public toastr: ToastrService, private modalService: BsModalService,
    private locationBack: Location, private report: ReportService) { }

  ngOnInit(): void {
    this.userSettlement('');
    this.settlementForm = this.fb.group({
      "settleamount": '0',
      "settleCmt": '',
    });
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
  openModalSettlement(userdata, i, parent_id, settleMent: TemplateRef<any>) {
    if (i == 1) {
      this.showButton = true;
    } else {
      this.showButton = false;
    }
    this.rightVal = userdata;
    this.settleAmt = this.rightVal.settlement_amount;
    this.parentDataId = parent_id;
    this.settlementForm.controls.settleamount.setValue(this.settleAmt)
    this.modalRef = this.modalService.show(
      settleMent,
      Object.assign({}, { class: 'settleMent-modal modal-lg' })
    );


  }
  openModalDeleteSettlement(deleteSettle: TemplateRef<any>) {
    this.modalRef = this.modalService.show(
      deleteSettle,
      Object.assign({}, { class: 'deleteSettle-modal modal-lg' })
    );
  }

  goToBack() {
    this.locationBack.back();
  }

  userSettlement(userId) {
    this.adminDetails = JSON.parse(localStorage.getItem('adminDetails'));
    if (this.callingType == 1) {
      this.backShowButton = false;
      this.callingType = 2;
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
          if (this.settlementCallingType == 1) {
            this.settlementData = res.data;
            this.paidtoData = res.data.data_paid_to.list;
            this.recedData = res.data.data_receiving_from.list;
            this.plusData = res.data.plusData;
            this.minusData = res.data.minusData;
            this.minusLength = res.data.minusData.length;
            this.plusLength = res.data.plusData.length;
            this.totalPlus = res.data.totalPlus;
            this.totalMinus = res.data.totalMinus;
            this.parent_id = res.data.parent_id;
            this.parentId = res.data.parent_id;
            this.user_id = res.data.user_id;
            this.parent_user_name = res.data.user;
          } else {
            this.settlementData = res.data;
            this.paidtoData = res.data.data_paid_to.list;
            this.recedData = res.data.data_receiving_from.list;
            this.plusData = res.data.plusData;
            this.minusData = res.data.minusData;
            this.minusLength = res.data.minusData.length;
            this.plusLength = res.data.plusData.length;
            this.totalPlus = res.data.totalPlus;
            this.totalMinus = res.data.totalMinus;
            this.parent_id = res.data.parent_id;
            this.user_id = res.data.user_id;
            this.parent_user_name = res.data.user;
          }

        } else {
          this.toastr.error(res.msg, '', {
            timeOut: 10000,
          })
        }
      })
    } else {
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
          this.settlementData = res.data;
          this.paidtoData = res.data.data_paid_to.list;
          this.recedData = res.data.data_receiving_from.list;
          this.plusData = res.data.plusData;
          this.minusData = res.data.minusData;
          this.minusLength = res.data.minusData.length;
          this.plusLength = res.data.plusData.length;
          this.totalPlus = res.data.totalPlus;
          this.totalMinus = res.data.totalMinus;
          this.parent_id = res.data.parent_id;
          this.user_id = res.data.user_id;
          this.parent_user_name = res.data.user;
          if (this.user_id == this.adminDetails.user_id) {
            this.backShowButton = false;
          } else {
            this.backShowButton = true;
          }
        } else {
          this.toastr.error(res.msg, '', {
            timeOut: 10000,
          })
        }
      })
    }

  }


  makeSettlement(crdr) {
    var userdata = {
      'user_id': this.rightVal.user_id,
      'type': crdr,
      'amount': this.settlementForm.controls.settleamount.value,
      'comment': this.settlementForm.controls.settleCmt.value
    };
    this.report.settlementAmount(userdata).subscribe(response => {
      if (response.status) {
        // this.settleamount = 0;
        // this.settleCmt = '';
        this.toastr.success(response.msg, '', {
          positionClass: 'toast-bottom-right',
          timeOut: 1000
        })
        // this.getSettlementList(this.userDetails.user_id,this.userDetails.user_type_id,1);
        if (response.data != '') {
          this.modalRef.hide();
        }
        if (this.parentId != this.parentDataId) {
          this.userSettlement(this.user_id)
        } else {
          this.userSettlement('');
        }

        // var uId = JSON.parse(localStorage.getItem('settleUserId'))
        // var uType = JSON.parse(localStorage.getItem('settleUserTypeId'))
        // this.getSettlementList(uId,uType,1);
      } else {
        this.toastr.error(response.msg, '', {
          timeOut: 10000,
        })
      }
    }, error => {
    });
  }
  goToStatement(user_id){
    this.router.navigate(['statement/'+ user_id])
  }
  openModalUserParentList(user, userParentList: TemplateRef<any>) {
    this.modalRef = this.modalService.show(
      userParentList,
      Object.assign({}, { class: 'modal-lg' })
    );
    this.userParentName = user.user_name;
    let data ={
      "user_id" : user.user_id
    }
    this.sport.showParentList(data).subscribe((res) => {
      if(res.status == true){
        this.parentList = res.data.agents ;
      } else {
        this.toastr.error(res.msg, '', {
          timeOut: 10000,
        })
      }
    })
  }
}
