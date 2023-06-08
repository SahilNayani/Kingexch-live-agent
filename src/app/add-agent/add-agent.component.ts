import { Component, OnInit, TemplateRef,ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, AbstractControl } from '@angular/forms';
import { UsersService } from '../services/users.service';
import { WebsiteSettingService } from '../services/website-setting.service';
import { LoginService } from '../services/login.service';
import { CookieService } from 'ngx-cookie-service';
import { AddAgentService } from './add-agent.service'
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from "@angular/router";
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Location } from '@angular/common';
import { AppValidationService } from '../app-validation/app-validation.service';
import { ValidatorControls } from '../app-validation/validation-controls.directive';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-add-agent',
  templateUrl: './add-agent.component.html',
  styleUrls: ['./add-agent.component.scss']
})
export class AddAgentComponent implements OnInit {
  @ViewChild('t1', {static: false}) userNametooltip: NgbTooltip;
  addAgentFrom: FormGroup;
  sportList: object[];
  websiteList: object[];
  userDetail;
  modalRef: BsModalRef;
  loginuserDetail: any
  public showPassword: boolean;
  permissions = []
  userPermissionsList = [];
  userSportPartnerShip: any;
  user_id: string;
  loggedInUserTypeId;
  addedSportShareList = [];
  refaddedSportShareList = [];
  addedSportShareDetails = {
    parent_share: 0,
    parent_id: null,
    parent_partnership_share: 0,
    user_share: 0,
    share: 0,
  };
  levels = []
  userTypeId = [];
  usersListReqPageQuery: any = {};
  shareEnter: any;
  sportSettingDetails: any;
  userSportSettingDetails = [];
  sId: any;
  hiddenpass: Array<boolean> = [];
  childLevelList: object[];
  showPS: boolean;
  parentLevelIds = [];
  isUserNameExist: boolean;
  submitted: boolean = false;
  update_user_id: any;
  domainName: any;
  parentCommission = [];
  shareMessageValidation: Array<boolean>=[]
  sportIndexForMessage = 25;
  tempSportPartnership = [];
  userData: any;
  parentLogInData: any;
  param: any;
  update_user_type_id: any;
  user_type_id: any;
  parent_name: string;
  constructor(private fb: FormBuilder, private router: Router, private toastr: ToastrService,
    private usersService: UsersService, private addAgentService: AddAgentService,
    private websiteSettingService: WebsiteSettingService,
    private loginService: LoginService, private cookie: CookieService, private modalService: BsModalService,
    private locationBack: Location, private route: ActivatedRoute,
    private appValidationService: AppValidationService
  ) {
    this.route.params.subscribe(params => {
      this.update_user_id = params.userid;
      this.update_user_type_id = params.userTypeId;
    });
  }

  ngOnInit(): void {
    this.showPS = false;
    this.userData = JSON.parse(localStorage.getItem('adminDetails'));
    if (this.router.url == '/addChild-agent/' + this.update_user_id + '/' + this.update_user_type_id) {
      this.user_id = this.update_user_id;
      this.user_type_id = this.update_user_type_id
      this.getLoginUseretails();
    } else {
      this.user_id = this.userData.user_id;
      this.user_type_id = this.userData.user_type_id;
      this.getLoginUseretails();
    }
    this.createAgentFrom();
  }

  goToBack() {
    this.locationBack.back();
  }

  createAgentFrom() {
    this.addAgentFrom = this.fb.group({
      parent_user_name: [''],
      domain: ['', Validators.required],
      domain_name:[''],
      name: ['', Validators.required],
      user_name: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      user_type_id: [0],
      parent_id: [null],
      create_no_of_child: [0],
      child_level: [null, Validators.required],
      point: [1, Validators.required],
      exposure_limit: [-1, Validators.required],
      match_commission: [0, Validators.required],
      session_commission: [0, Validators.required],
      sports_permission: this.fb.array([]),
      sports_share: [],
      user_id: null,
      parent_level_ids: [],
      match_stack:[]
    })
    this.appValidationService.applyValidationRulesToFromGroup(this.addAgentFrom, "AddAgent").then((validators) => {
    }).catch(() => { })
  }

  getLoginUseretails() {
    this.param = {
      "user_id": this.user_id,
      "user_type_id": this.user_type_id
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
      this.parentLevelIds.push({ user_id: this.userDetail._id, user_type_id: this.loggedInUserTypeId
        ,user_name : this.userDetail.user_name, name: this.userDetail.name
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
        this.addAgentFrom.controls['session_commission'].setValue(this.userDetail.session_commission);
        this.addAgentFrom.controls['session_commission'].setValidators([ValidatorControls.minValueValidator(this.userDetail.session_commission, true, ("The session commision minimum value should be " + this.userDetail.session_commission))])
        this.addAgentFrom.controls['match_commission'].setValidators([ValidatorControls.minValueValidator(this.userDetail.match_commission, true, ("The match commision minimum value should be " + this.userDetail.match_commission))])
        this.addAgentFrom.controls['match_commission'].updateValueAndValidity()
        this.addAgentFrom.controls['session_commission'].updateValueAndValidity()
      }
    }, error => {
      console.log(error)
    })
  }

  get f() { return this.addAgentFrom.controls; }

  checkedPermissions(event, index) {
    let formGroupcontrol = this.addAgentFrom.get('sports_permission')['controls'][index]
    formGroupcontrol.controls.is_allow.value = !formGroupcontrol.controls.is_allow.value
    formGroupcontrol.controls.is_allow.patchValue(formGroupcontrol.controls.is_allow.value)
  }

  // sports_share
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

  addAgent() {
    this.submitted = true;
    this.checkUserName(this.addAgentFrom.controls.user_name.value)
    this.appValidationService.markFormGroupTouched(this.addAgentFrom)
    if( this.isUserNameExist){
      this.userNametooltip.open()
    }
    let userShareDetails =this.userSportPartnerShip.filter(object=>object.percentage[object.percentage.length-1].user_share === null);
    let shareErrors=this.shareMessageValidation.filter(object=>object!=null)
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
        delete this.addAgentFrom.value['child_level'];
        delete this.addAgentFrom.value['parent_user_name'];
        delete this.addAgentFrom.value['create_no_of_child'];
        delete this.addAgentFrom.value['parent_level_ids'];
        delete this.addAgentFrom.value['match_stack'];
        this.addAgentFrom.value.sports_permission = this.addAgentFrom.value.sports_permission.filter(t => t.is_allow == true );
        this.addAgentService.addAgent(this.addAgentFrom.value).subscribe((result) => {
          if (result.status == true) {
            this.toastr.success(result.msg,'',{
              positionClass: 'toast-bottom-right',
              timeOut:1000
             });
            this.router.navigateByUrl('user')
          } else {
            this.toastr.error(result.msg,'',{
              timeOut: 10000,
            });
          }
        }, (err) => {
          console.log(err);
        });
      }
  }

  selectedDomain(event) {
    if(event.domain_name){
      this.addAgentFrom.controls.domain_name.setValue(event.domain_name)
    }
   }

   addUserEnteredShareInList(share, sport, index) {
    this.showPS = true;
    if (share == null || share == undefined) {
      share = 0;
    }
    if (share != null || share != undefined) {
      if(share != 0){
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

  openModalParent(parent: TemplateRef<any>) {
    this.modalRef = this.modalService.show(
      parent,
      Object.assign({}, { class: 'parent-modal modal-lg' })
    );
  }

  accordion(sportId) {
    this.sId = sportId;
  }

  hide(index) {
    this.hiddenpass[index] = !this.hiddenpass[index];
  }

  checkUserName(username) {
    var obj: any = {};
    obj.user_name = username;
    this.usersService.checkUserName(obj).subscribe((result) => {
      if (result.msg != 'Username is already exists. ') {
        this.isUserNameExist = false;
        
        this.addAgentFrom.controls['user_name'].setErrors({duplicateCheck:null});
        this.addAgentFrom.controls['user_name'].updateValueAndValidity();
        //this.fb.group({ username: ['', Validators.required] })
      } else {
        this.isUserNameExist = true;
        this.addAgentFrom.controls['user_name'].setValidators([ValidatorControls.duplicateCheck(this.addAgentFrom.controls['user_name'].value,'user name already exist'),ValidatorControls.requiredValidator('user name is required'),ValidatorControls.cannotContainSpace('Invalid Username'),ValidatorControls.minLengthValidator(3,'Username should be minimum 3 characters ')]);
        this.addAgentFrom.controls['user_name'].updateValueAndValidity();
       // this.fb.group({ username: ['', Validators.required] })
      }
    }, (err) => {
      console.log(err);
    });
  }

  applyValidationToFormGroup(formGroupName, jsonArrayName) {
    this.appValidationService.applyValidationRulesToFromGroup(formGroupName, jsonArrayName).then((validators) => {
    }).catch(() => { })
  }

}
