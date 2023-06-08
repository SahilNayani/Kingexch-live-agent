import { Component, OnInit, TemplateRef, ChangeDetectorRef, Input,ViewChild } from '@angular/core';
import { Router } from "@angular/router";
import { LoginService } from '../services/login.service';
import { CookieService } from 'ngx-cookie-service';
import { UsersService } from '../services/users.service';
import { ReportService } from '../services/report.service';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { UserIdleService } from 'angular-user-idle';
import { SocketServiceService } from '../services/socket-service.service';
import { AppValidationService } from '../app-validation/app-validation.service';
import { ValidatorControls } from '../app-validation/validation-controls.directive';
import { SportService } from '../services/sport.service';
import { resolve } from 'q';
import * as moment from 'moment';
import { environment } from '../../environments/environment';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html', 
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @ViewChild('resetPwd', {static: true}) public privacyPopup: TemplateRef<any>;
  // @Input() 
  walletBalance: any;
  user_id: string;
  moment: any = moment;
  userDetail: any;
  depositWithdrawlForm: FormGroup;
  userChipsData: any;
  modalRef: BsModalRef;
  changePasswordForm: FormGroup;
  submitted = false;
  userMatchStack: any;
  match_stack: Array<number> = []
  globalSetting: any;
  checkRandomNumber;
  adminDetails: any;
  isSocket;
  token: string;
  parentLogInData: any;
  param: any;
  showSelectedUserName: any;
  selectedUserId: any;
  specificUserDetails = [];
  sportsForm: FormGroup;
  hiddenpass: Array<boolean> = [];
  searchFilterValue: any;
  // socket: any;
  selectedIndex: number = 0;
  //sports related parameters
  homeData: any;
  userData: any;
  runnerData: any;
  firstData: any;
  parameter: any;
  a: any = [];
  balTimer: any;
  searchSport: string;
  sportErrorData: any;
  specificUserParentDetails: any;
  exposureData: any;
  expoLength: any;
  expo_User_name: any;
  checkEventLimit: any;
  logo: string;
  pass: boolean = false;
  expoRouteData: any;
  allData: any;
  adminData: any;
  adminHeading: any;
  public Base_Url = environment['adminServerUrl'];
  domainName: string;
  domainData: string;
  constructor(private cdRef: ChangeDetectorRef, private router: Router, private fb: FormBuilder, private toastr: ToastrService, public sport: SportService,
    private loginService: LoginService, private usersService: UsersService, private modalService: BsModalService,private report: ReportService,
    private cookie: CookieService, private appValidationService: AppValidationService, private userIdle: UserIdleService, private socketService: SocketServiceService) {
    // this.socket = io('http://localhost:3002');
  }

  async ngOnInit() {
    this.logo = localStorage.getItem('logo')
    this.adminDetails = JSON.parse(localStorage.getItem('adminDetails'));
    this.getNews();
    if(this.adminDetails.is_change_password == '0' && this.adminDetails.user_type_id != '0'){
      this.pass = true;
      this.openModalResetPwd(this.privacyPopup)
    }
    // await this.socketService.setUpSocketConnection();
    this.isSocket = this.cookie.get('is_socket');
    this.isSocket = 0;
    if (this.isSocket == null || this.isSocket == undefined || this.isSocket == '') {
      // this.getGlobalSettings();
    }
    this.token = localStorage.getItem('adminAccessToken');
    if (this.adminDetails?.user_type_id != 0 && this.adminDetails?.is_multi_login_allow != 1)
      this.logoutListenUser();

    this.createSuperAdminDepositWithdrawForm();
    // this.getLoginUseretails();
    this.createChangePasswordFrom();
    this.getUserBalance();
    // this.getUserMatchStackDetails();
    // this.socketListenersUser();
    this.sportsForm = this.fb.group({
      sports_settings: this.fb.array([])
    })

    this.usersService.balanceChange.subscribe(isOpen => {
      // this.getLoginUseretails();
    });

    // this.socketService.socket.on('userDataInit', (data) => {

    //   // this.getUseretailsOnSocketEmit();
    // })

    //Start watching for user inactivity.
    // this.userIdle.startWatching();

    // // Start watching when user idle is starting.
    // this.userIdle.onTimerStart();

    // // Start watch when time is up.
    // this.userIdle.onTimeout().subscribe(() => {
    //   this.logoutUser();
    //   this.stop();
    //   this.stopWatching();

    //   });

  }
  // stop() {
  //   this.userIdle.stopTimer();
  // }

  // stopWatching() {
  //   this.userIdle.stopWatching();
  // }
  openModalSportSetting(sportSetting: TemplateRef<any>, user) {
    this.sportErrorData = undefined
    this.showSelectedUserName = user.user_name;
    this.getUserSportsWiseSettingDetails(user._id, user.userSettingSportsWise)
    this.modalRef = this.modalService.show(
      sportSetting,
      Object.assign({}, { class: 'sportSetting-modal modal-lg' })
    );
  }

  getUserSportsWiseSettingDetails(user_id, settingId) {
    this.usersService.getSportSetting({ 'user_id': user_id, '_id': settingId }).subscribe(result => {
      this.checkEventLimit = result.check_event_limit;
      this.specificUserDetails = result.data.sports_settings
      if (result.data.sports_settings.length !== result.data.parent_sports_settings.length) {
        this.specificUserParentDetails = []
        this.specificUserDetails.forEach((element, index) => {

          this.specificUserParentDetails.push(result.data.parent_sports_settings[0])
        });
      } else {
        this.specificUserParentDetails = result.data.parent_sports_settings
      }
      this.createSportsSettingArray()
    })
  }
  get sportsSettingsFormArr(): FormArray {
    return this.sportsForm.get('sports_settings') as FormArray;
  }
  createSportsSettingArray() {
    this.adminDetails = JSON.parse(localStorage.getItem('adminDetails'));
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
          name: sport.name,
          _id: sport._id
        })
      );
      this.applyValidationToFormGroup(this.sportsSettingsFormArr.controls[index], "sportsSettings")
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
      // this.sportsSettingsFormArr.controls[index]['controls'].session_max_profit.setValidators(ValidatorControls.maxValueValidator(sport.session_max_profit,true,"Session Max Profit value should not be greater than parent value"))
      if (this.adminDetails.user_type_id == 0) {
        this.sportsSettingsFormArr.controls[index]['controls'].market_min_stack.setValidators([ValidatorControls.requiredValidator("Market Min Stack is required"), ValidatorControls.minValueValidator(this.specificUserParentDetails[index].market_min_stack.value, true, "Market Min Stack value should not be less than or equal to "+this.specificUserParentDetails[index].market_min_stack.value, false)])
        this.sportsSettingsFormArr.controls[index]['controls'].market_max_stack.setValidators([ValidatorControls.requiredValidator("Market Max Stack is required"), ValidatorControls.minValueValidator(this.sportsSettingsFormArr.controls[index]['controls'].market_min_stack.value, true, "Market Max Stack value should not be less than Market Min Stack", false), ValidatorControls.maxValueValidator(this.specificUserParentDetails[index].market_max_stack_max_limit, true, "Market Max Stack value should not be greater than " + this.specificUserParentDetails[index].market_max_stack_max_limit)])
        this.sportsSettingsFormArr.controls[index]['controls'].market_min_odds_rate.setValidators([ValidatorControls.requiredValidator("Market Min odds rate is required"), ValidatorControls.minValueValidator(this.specificUserParentDetails[index].market_min_odds_rate, true, "Market Min odds rate value should not be less " + this.specificUserParentDetails[index].market_min_odds_rate, false)])
        this.sportsSettingsFormArr.controls[index]['controls'].market_max_odds_rate.setValidators([ValidatorControls.requiredValidator("Market Max odds rate is required"), ValidatorControls.minValueValidator(this.sportsSettingsFormArr.controls[index]['controls'].market_min_odds_rate.value, true, "Market Max odds rate value should not be less than Market Min odds rate", false), ValidatorControls.maxValueValidator(this.specificUserParentDetails[index].market_max_odds_rate, true, "Market Max odds rate value should not be greater than " + this.specificUserParentDetails[index].market_max_odds_rate)])
        this.sportsSettingsFormArr.controls[index]['controls'].market_max_profit.setValidators([ValidatorControls.requiredValidator("Market Max profit is required"), ValidatorControls.minValueValidator(this.specificUserParentDetails[index].market_profit_range, true, "Market Max profit value should not be less than " + this.specificUserParentDetails[index].market_profit_range, false), ValidatorControls.maxValueValidator(this.specificUserParentDetails[index].market_max_profit_max_limit, true, "Market Max Profit rate value should not be greater than " + this.specificUserParentDetails[index].market_max_profit_max_limit)])
        this.sportsSettingsFormArr.controls[index]['controls'].market_advance_bet_stake.setValidators([ValidatorControls.requiredValidator("Before Inplay Match Stake is required"), ValidatorControls.minValueValidator(1, true, "Before Inplay Match Stake value should not be less than or equal to 0 ", false), ValidatorControls.maxValueValidator(this.specificUserParentDetails[index].market_advance_bet_stake_max_limit, true, "Before Inplay Match Stake value should not be more than " + this.specificUserParentDetails[index].market_advance_bet_stake_max_limit)])
        this.sportsSettingsFormArr.controls[index]['controls'].market_bet_delay.setValidators([ValidatorControls.requiredValidator("Match Bets Delay is required"), ValidatorControls.minValueValidator(this.specificUserParentDetails[index].market_min_bet_delay, true, "Match Bets Delay value should not be less than " + this.specificUserParentDetails[index].market_min_bet_delay, false), ValidatorControls.maxValueValidator(this.specificUserParentDetails[index].market_max_bet_delay, true, "Match Bets Delay value should not be more than " + this.specificUserParentDetails[index].market_max_bet_delay)])
        this.sportsSettingsFormArr.controls[index]['controls'].session_min_stack.setValidators([ValidatorControls.requiredValidator("Min. Stake Amount  is required"), ValidatorControls.minValueValidator(this.specificUserParentDetails[index].session_min_stack.value, true, "Min. Stake Amount value should not be less than or equal to "+ this.specificUserParentDetails[index].session_min_stack.value, false)])
        this.sportsSettingsFormArr.controls[index]['controls'].session_bet_delay.setValidators([ValidatorControls.requiredValidator("Session Bet Delay is required"), ValidatorControls.minValueValidator(this.specificUserParentDetails[index].session_min_bet_delay, true, "Session Bet Delay value should not be less than  " + this.specificUserParentDetails[index].session_min_bet_delay, false), ValidatorControls.maxValueValidator(this.specificUserParentDetails[index].session_max_bet_delay, true, "Session Bet Delay value should not be more than " + this.specificUserParentDetails[index].session_max_bet_delay)])
        this.sportsSettingsFormArr.controls[index]['controls'].session_max_stack.setValidators([ValidatorControls.requiredValidator("Max. Stake Amount is required"), ValidatorControls.minValueValidator(this.sportsSettingsFormArr.controls[index]['controls'].session_min_stack.value, true, "Max. Stake Amount value should not be less than min Stake Amount value", false), ValidatorControls.maxValueValidator(this.specificUserParentDetails[index].session_max_stack_max_limit, true, "Max. Stake Amount value should not be greater than " + this.specificUserParentDetails[index].session_max_stack_max_limit)])
        this.sportsSettingsFormArr.controls[index]['controls'].session_max_profit.setValidators([ValidatorControls.requiredValidator("Session Max Profit is required"), ValidatorControls.minValueValidator(this.specificUserParentDetails[index].session_profit_range, true, "Session Max Profit value should not be less than " + this.specificUserParentDetails[index].session_profit_range, false), ValidatorControls.maxValueValidator(this.specificUserParentDetails[index].session_max_profit, true, "Session Max Profit rate value should not be greater than " + this.specificUserParentDetails[index].session_max_profit)])
      } else {
        this.sportsSettingsFormArr.controls[index]['controls'].market_min_stack.setValidators([ValidatorControls.requiredValidator("Market Min Stack is required"), ValidatorControls.minValueValidator(this.specificUserParentDetails[index].market_min_stack.value, true, "Market Min Stack value should not be less than parent value", false)])
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
        this.sportsSettingsFormArr.updateValueAndValidity();
      }
      this.hiddenpass.push(true)
    });

  }
  applyValidationToFormGroup(formGroupName, jsonArrayName) {
    this.appValidationService.applyValidationRulesToFromGroup(formGroupName, jsonArrayName).then((validators) => {
    }).catch(() => { })
  }
  updateSportWiseSettingDetails(sport, sportIndex) {
    let compareResult = this.objectsAreSame(this.sportsForm.controls.sports_settings.value[sportIndex], this.specificUserDetails[sportIndex])
    if (!compareResult.objectsAreSame) {
      let filteredSports_settings = [];
      let _id = this.sportsForm.controls.sports_settings.value[sportIndex]._id
      filteredSports_settings.push(compareResult.differentValueObject);
      let data = {
        // sports_settings_id: this.sportsForm.controls.sports_settings.value[sportIndex]._id,
        sport_id: (this.sportsForm.controls.sports_settings.value[sportIndex].sport_id),
        sports_settings: filteredSports_settings
      }
      if (this.sportsForm.invalid) {
        return
      }

      this.usersService.updateSportWiseSettingDetails(data).subscribe(result => {
        if (result.status == true) {
          this.sportErrorData = undefined
          this.toastr.success(result.msg, '', {
            positionClass: 'toast-bottom-right',
            timeOut: 1000
          });
          this.modalRef.hide();
        } else if (result.is_validation_error) {
          this.sportErrorData = result.data
          this.toastr.error(result.msg, '', {
            timeOut: 10000,
          });
        } else {
          this.toastr.error(result.msg, '', {
            timeOut: 10000,
          });
        }
      })

    }
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
  user() {
    this.router.navigate(['user'])
  }
  addUser() {
    this.router.navigate(['master'])
  }
  addAgent() {
    this.router.navigate(['add-agent'])
  }
  websiteSetting() {
    this.router.navigate(['website-setting'])
  }
  importMarket() {
    this.router.navigate(['import-market'])
  }
  rollback() {
    this.router.navigate(['match-rollback'])
  }
  fancyRollback() {
    this.router.navigate(['fancy-rollback'])
  }
  sportPl() {
    this.router.navigate(['sport-pl'])
  }
  fancyPl() {
    this.router.navigate(['fancypl'])
  }
  fancyStake() {
    this.router.navigate(['fancyStake'])
  }
  Stake(){
    this.router.navigate(['marketStake'])
  }
  blockMarket() {
    this.router.navigate(['block-market'])
  }
  onlineUser() {
    this.router.navigate(['online-user'])
  }
  closedUser() {
    this.router.navigate(['closed-user'])
  }
  accountInfo() {
    this.router.navigate(['account-info'])
  }
  accountStatement() {
    this.router.navigate(['statement'])
  }
  chipSummary() {
    this.router.navigate(['chip-summary'])
  }
  betHistory() {
    this.router.navigate(['bet-history'])
  }
  liveBetHistory() {
    this.router.navigate(['live-bet'])
  }
  deleteBet() {
    this.router.navigate(['delete-bet'])
  }
  profitLoss(user_id,user_type_id) {
    this.router.navigate(['profit-loss/'+user_id + '/'+ user_type_id])
  }
  openBets() {
    this.router.navigate(['open-bet'])
  }
  settledBets() {
    this.router.navigate(['settled-bet'])
  }
  dashboard() {
    this.router.navigate(['dashboard'])
  }
  myMarket() {
    this.router.navigate(['my-market'])
  }
  matchResult() {
    this.router.navigate(['match-result'])
  }
  fancyResult() {
    this.router.navigate(['fancy-result'])
  }
  messageSetting() {
    this.router.navigate(['message-setting'])
  }
  goToHome() {
    this.router.navigate(['dashboard'])
  }
  agentCommission() {
    this.router.navigate(['commission'])
  }
  downpl() {
    this.router.navigate(['downpl'])
  }
  eventpl() {
    this.router.navigate(['eventpl'])
  }
  history() {
    this.router.navigate(['history'])
  }
  marketAnalysisDetail() {
    this.router.navigate(['my-market']);
  }
  openModalResetPwd(resetPwd: TemplateRef<any>) {
    this.modalRef = this.modalService.show(
      resetPwd,
      Object.assign({}, { class: 'userPwd-modal',ignoreBackdropClick: true })
    );
  }
  openModalChangeStack(stackValue: TemplateRef<any>) {
    this.getUserMatchStackDetails();
    this.modalRef = this.modalService.show(
      stackValue,
      Object.assign({}, { class: 'stackValue-modal modal-lg' })
    );
  }

  // socketOnEvent(eventName, callback) {
  //   this.socketService.socket.on(eventName, data => callback(data));
  // }

  // socketEmitEvent(eventName, data) {
  //   this.socketService.socket.emit(eventName, data);
  // }

  // socketListenersUser() {
  //   // this.socketOnEvent(`getUserDetails`, data => {

  //   //   if (data.status == true) {
  //   //     this.userDetail = data.data;
  //   //   } else {
  //   //     this.toastr.error(data.msg,'',{
  //     //   timeOut: 10000,
  //     // });
  //   //   }
  //   // });


  //   this.socketOnEvent(`chipInOut`, data => {
  //     if (data.status == true) {

  //       this.toastr.success(data.msg,'',{
  //         positionClass: 'toast-bottom-right',
  //         timeOut:1000
  //        });
  //       this.modalRef.hide();
  //       this.usersService.updatechangeBalance();

  //     } else {
  //       this.toastr.error(data.msg,'',{
  //         timeOut: 10000,
  //       });
  //     }
  //   });

  //   this.socketOnEvent(`updateForChangePasswordAfterLogin`, data => {
  //     if (data.status == true) {
  //       this.submitted = false;
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

  //   this.socketOnEvent(`getUserBalance`, data => {

  //     if (data.status == true) {
  //       this.walletBalance = data.data

  //       this.cdRef.detectChanges();
  //     } else {
  //       this.toastr.error(data.msg,'',{
  //         timeOut: 10000,
  //       });
  //     }
  //   });

  //   this.socketOnEvent(`getUserMatchStack`, data => {

  //     if (data.status == true) {
  //       this.userMatchStack = data.data;
  //       this.match_stack = this.userMatchStack.match_stack
  //       this.cdRef.detectChanges();
  //     } else {
  //       this.toastr.error(data.msg,'',{
  //         timeOut: 10000,
  //       });
  //     }
  //   });

  //   this.socketOnEvent(`updateUserMatchStack`, data => {
  //     if (data.status == true) {
  //       this.submitted = false;
  //       this.toastr.success(data.msg,'',{
  //         positionClass: 'toast-bottom-right',
  //         timeOut:1000
  //        });
  //       this.getUserMatchStackDetails();
  //       this.modalRef.hide();
  //     } else {
  //       this.toastr.error(data.msg,'',{
  //         timeOut: 10000,
  //       });
  //     }
  //   });

  // }


  logoutListenUser() {

    this.logoutUserFromAllDevices();

    // this.socketOnEvent(`logoutUserFromAllDevices${this.adminDetails._id}`, data => {
    //   this.token = localStorage.getItem('adminAccessToken');
    //   if (data.status == true && data.ran_number != this.token) {
    //     this.cookie.delete('userId');
    //     // this.cookie.delete('accessToken');
    //     // this.cookie.delete('refreshToken');
    //     this.cookie.delete('is_socket');
    //     this.cookie.delete('transaction-password');
    //     this.cookie.delete('transaction_password_timeout')
    //     localStorage.removeItem("adminDetails");
    //     this.loginService.clearLocalStorage()
    //     this.router.navigate(['login'])
    //     window.location.replace('login');
    //   }
    // });

  }

  logoutUserFromAllDevices() {

    // this.socketEmitEvent('logoutUserFromAllDevices', { user_id: this.adminDetails._id, ran_number: this.token });
  }

  openModalDeposit(deposite: TemplateRef<any>) {
    this.modalRef = this.modalService.show(
      deposite,
      Object.assign({}, { class: 'deposite-modal modal-lg' })
    );
  }


  openModalWithdraw(withdraw: TemplateRef<any>) {
    this.modalRef = this.modalService.show(
      withdraw,
      Object.assign({}, { class: 'withdraw-modal modal-lg' })
    );
  }

  createSuperAdminDepositWithdrawForm() {
    this.depositWithdrawlForm = this.fb.group({
      "accChips": 0,
      "reMark": '',
      "userPass": ''
    });

  }
  status: boolean = false;
  headerNav() {
    this.status = !this.status;
  }

  depositWithdrawl(crdr) {
    this.userChipsData = {
      "user_id": this.user_id,
      "parent_id": this.user_id,
      "crdr": crdr,
      "amount": this.depositWithdrawlForm.controls.accChips.value,
      "remark": this.depositWithdrawlForm.controls.reMark.value,
      "password": this.depositWithdrawlForm.controls.userPass.value
    }
    if (this.isSocket != 1) {
      this.usersService.depositWithdrawl(this.userChipsData).subscribe(data => {
        if (data.status == true) {
          //   this.userParentData  = data.data;
          this.toastr.success(data.msg, '', {
            positionClass: 'toast-bottom-right',
            timeOut: 1000
          });
          this.modalRef.hide();
          this.usersService.updatechangeBalance();

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
      // this.socketEmitEvent('chip-in-out', this.userChipsData);
    }

  }


  logoutUser() {
    let data = {}
    this.loginService.adminlogout(data).subscribe(result => {
      if (result.status == true) {
        this.cookie.delete('userId');
        // this.cookie.delete('accessToken');
        // this.cookie.delete('refreshToken');
        this.cookie.delete('is_socket');
        this.cookie.delete('transaction-password');
        this.cookie.delete('transaction_password_timeout')
        localStorage.removeItem("adminDetails");
        //this.loginService.clearLocalStorage()
        this.loginService.clearLocalStorage()
        this.router.navigate(['login'])
        window.location.replace('login');
      } else {
        if (result.logout == true) {
          this.cookie.delete('userId');
          // this.cookie.delete('accessToken');
          // this.cookie.delete('refreshToken');
          this.cookie.delete('is_socket');
          this.cookie.delete('transaction-password');
          this.cookie.delete('transaction_password_timeout')
          localStorage.removeItem("adminDetails");
          //this.loginService.clearLocalStorage()
          this.loginService.clearLocalStorage()
          this.router.navigate(['login'])
          window.location.replace('login');
        }
        this.toastr.error(result.msg, '', {
          timeOut: 10000,
        });
      }
    })

  }

  createChangePasswordFrom() {
    this.changePasswordForm = this.fb.group({

      old_password: ['', [Validators.required]],
      new_password: ['', [Validators.required]],
      confirm_password: ['', [Validators.required]]

    })
  }



  get f() { return this.changePasswordForm.controls; }

  onSubmitChangePassword() {
    this.submitted = true;

    if (this.changePasswordForm.invalid) {
      return;
    }

    if (this.changePasswordForm.controls['new_password'].value == this.changePasswordForm.controls['confirm_password'].value) {
      console.log("641",this.changePasswordForm.value.new_password);
      let data = {
        "newPassword": this.changePasswordForm.value.new_password
      }
      if (this.isSocket != 1) {
        this.usersService.updatePassword(data).subscribe((result) => {
          if (result.status == true) {
            this.submitted = false;
            this.modalRef.hide();
            this.logoutUser();
            this.cdRef.detectChanges();
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

      else {
        // this.socketEmitEvent('update-for-change-password-after-login', this.changePasswordForm.value);
      }

    }

    else {
      this.toastr.error("Password and confirm password did not match", '', {
        timeOut: 10000,
      });
    }


  }
  getUserBalance() {
    this.user_id = localStorage.getItem('userId');
    if (this.isSocket != 1) {
      let data = {}
      this.usersService.getUserBalance(data).subscribe(response => {
        if(response.status == true){
          this.walletBalance = response.data;
          this.cdRef.detectChanges();
        } else {
          if(response.logout == true){
            this.cookie.delete('userId');
            // this.cookie.delete('accessToken');
            // this.cookie.delete('refreshToken');
            this.cookie.delete('is_socket');
            this.cookie.delete('transaction-password');
            this.cookie.delete('transaction_password_timeout')
            localStorage.removeItem("adminDetails");
            //this.loginService.clearLocalStorage()
            this.loginService.clearLocalStorage()
            this.router.navigate(['login'])
            window.location.replace('login');
          }
          
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
    else {
      // this.socketEmitEvent('get-user-balance', { userid: this.user_id });
    }

  }

  getUserMatchStackDetails() {
    this.user_id = localStorage.getItem('userId');
    if (this.isSocket != 1) {
      this.usersService.getUserMatchStack(this.user_id).subscribe(response => {
        this.userMatchStack = response.data;
        this.match_stack = this.userMatchStack.match_stack;
        this.cdRef.detectChanges();
      })
    }
    else {
      // this.socketEmitEvent('get-user-match-stack', { userid: this.user_id });
    }

  }

  updateUserMatchStack() {
    let stackRequest = {
      // "userid": this.userMatchStack._id,
      "match_stack": this.match_stack
    }
    if (this.isSocket != 1) {
      this.usersService.updateUserMatchStack(stackRequest).subscribe(result => {
        if (result.status == true) {
          this.submitted = false;
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
      })
    }
    else {
      // this.socketEmitEvent('update-user-match-stack', stackRequest);
    }

  }


  updateSocketStatus() {

    this.usersService.updateUseIsSocket().subscribe(result => {
      if (result.status == true) {
        this.submitted = false;
        this.toastr.success(result.msg, '', {
          positionClass: 'toast-bottom-right',
          timeOut: 1000
        });
        // this.cookie.set( 'is_socket', this.globalSetting.is_socket );
        this.getGlobalSettings();
        this.modalRef.hide();

      } else {
        this.toastr.error(result.msg, '', {
          timeOut: 10000,
        });
      }
    })
  }

  getGlobalSettings() {

    this.usersService.getGlobalSettings().subscribe(response => {
      this.globalSetting = response.data;
      this.cookie.delete('is_socket');
      this.cookie.set('is_socket', this.globalSetting.is_socket);
      this.cookie.set('transaction_password_timeout', this.globalSetting.transaction_password_timeout);
      this.isSocket = this.globalSetting.is_socket;
      this.cdRef.detectChanges();
    }, error => {
      console.log(error)
    })

  }
  selectPill(i) {
    this.selectedIndex = i;
  }
  homematches() {
    this.sport.getHomeMatchesList(this.userData).subscribe(res => {
      if (res.status) {
        this.homeData = res.data;
      } else {
        this.toastr.error(res.msg, '', {
          timeOut: 10000,
        });
      }
    }, (err) => {
      console.log(err);
    }
      // , () => {
      //   if (this.router.url.split('?')[0] == '/dashboard' || this.router.url.split('?')[0] == '/dashboard/' + this.parameter) {
      //     this.timer = setTimeout(() => resolve(this.homematches()), 60000);
      //   }
      // }
    )
  }

  searchFilter(matchData) {
    localStorage.setItem('matchData', JSON.stringify(matchData));
    this.router.navigate(['match-detail']);
  }

  matchDetail(matchData) {
    localStorage.setItem('matchData', JSON.stringify(matchData));
    if (this.router.url.split('?')[0] == '/match-detail') {
      window.location.reload();
    } else {
      this.router.navigate(['match-detail']);
    }
  }

  applyValidatorsForMaxStack(index) {
    this.sportsSettingsFormArr.controls[index]['controls'].market_max_stack.setValidators([ValidatorControls.requiredValidator("Market Max Stack is required"), ValidatorControls.minValueValidator(this.sportsSettingsFormArr.controls[index]['controls'].market_min_stack.value, true, "Market Max Stack value should not be less than Market Min Stack", false), ValidatorControls.maxValueValidator(this.specificUserParentDetails[index].market_max_stack, true, "Market Max Stack value should not be greater than parent value")])
    this.sportsSettingsFormArr.controls[index]['controls'].market_max_stack.updateValueAndValidity();

  }

  applyValidatorsForMaxOddsRate(index) {
    this.sportsSettingsFormArr.controls[index]['controls'].market_max_odds_rate.setValidators([ValidatorControls.requiredValidator("Market Max odds rate is required"), ValidatorControls.minValueValidator(this.sportsSettingsFormArr.controls[index]['controls'].market_min_odds_rate.value, true, "Market Max odds rate value should not be less than Market Min odds rate", false), ValidatorControls.maxValueValidator(this.specificUserParentDetails[index].market_max_odds_rate, true, "Market Max odds rate value should not be greater than parent value")])
    this.sportsSettingsFormArr.controls[index]['controls'].market_max_odds_rate.updateValueAndValidity();
  }

  applyValidatorsForMaxstake(index) {
    this.sportsSettingsFormArr.controls[index]['controls'].session_max_stack.setValidators([ValidatorControls.requiredValidator("Max. Stake Amount is required"), ValidatorControls.minValueValidator(this.sportsSettingsFormArr.controls[index]['controls'].session_min_stack.value, true, "Max. Stake Amount value should not be less than min Stake Amount value", false), ValidatorControls.maxValueValidator(this.specificUserParentDetails[index].session_max_stack, true, "Max. Stake Amount value should not be greater than parent value")])
    this.sportsSettingsFormArr.controls[index]['controls'].session_max_stack.updateValueAndValidity();
  }


  openModalExposure(exposure: TemplateRef<any>) {
    this.modalRef = this.modalService.show(
      exposure,
      Object.assign({}, { class: 'resetPwd-modal modal-lg' })
    );
    this.adminDetails = JSON.parse(localStorage.getItem('adminDetails'));
    let data = {
      "user_id": this.adminDetails.user_id
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

  trackByFn(index: any, item: any) {
    return index;
  }

  onFocusSearchInputEvent(event: any) {
    this.homematches()
  }
  parentValidationToggle(user, status) {
    let request = {
      "user_id": user.user_id,
      "check_event_limit": !status
    }
    this.usersService.eventCheckApi(request).subscribe(response => {
      if (response.status == true) {
        this.toastr.success(response.msg, '', {
          positionClass: 'toast-bottom-right',
          timeOut: 1000
        });
        this.getUserSportsWiseSettingDetails(user.user_id, user.userSettingSportsWise)
        // user.check_event_limit=!user.check_event_limit
        this.sportsForm.get('sports_settings')['controls'] = []
        this.createSportsSettingArray()

      } else {
        this.checkEventLimit = status;
        this.getUserSportsWiseSettingDetails(user.user_id, user.userSettingSportsWise)
        this.toastr.error(response.msg, '', {
          timeOut: 10000,
        })
      }

    })

  }

  expoRoute( id){
    let data = {
      "event": "match",
      "filter": {
          "match_id":id.match_id
      },
      "projection": [
          "enable_fancy",
          "inplay",
          "is_created",
          "is_lock",
          "is_active",
          "match_date",
          "bet_count"
      ]
  }
  this.sport.getExposureRoute(data).subscribe((res) => {
    this.expoRouteData = res.data;
    this.expoRouteData.manualInplay = res.data.inplay;
    let a3 = {...id, ...this.expoRouteData};
    localStorage.setItem('matchData', JSON.stringify(a3));
    this.router.navigate(['match-detail']);
    this.modalRef.hide();
  })
  }

  account(id,type){
    console.log(this.adminDetails, '*******************');
    this.router.navigate(['account-info/'+ id + '/' + type])
  }

  getNews() {
    let data = {};
    this.report.getNews(data).subscribe((res) => {
      if (res.status) {
        if (res.data == null) {
          this.adminHeading = '';
        } else {
          this.allData = res.data;
          this.adminData = this.allData.filter(t => t.user_type_id == 0);
          if (this.adminData.length != 0) {
            this.adminHeading = this.adminData[0].heading;
          }
        }
      }
    })
  }
}
