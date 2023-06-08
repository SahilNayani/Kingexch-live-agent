import { Injectable, Output, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders, HttpHeaderResponse, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as CryptoJS from 'crypto-js';
import { environment } from '../../environments/environment';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  public Base_Url = environment['adminServerUrl'];
  public token = localStorage.getItem('adminAccessToken');
  @Output() balanceChange = new EventEmitter();
  @Output() socketChange = new EventEmitter();


  constructor(private http: HttpClient, private cookie: CookieService) {
  }

  reqHeader = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ` + this.token
  });

  updatechangeBalance() {
    this.balanceChange.emit();
  }

  emitSocketByEmmitor(data) {
    this.socketChange.emit();
  }


  getLoginUseretails(param) {

    return this.http.post<any>(this.Base_Url + 'user/detailsForAdd', param, { headers: this.reqHeader });
  }

  getAllSport() {
    return this.http.get<any>(this.Base_Url + 'sports/getAllSportsList', { headers: this.reqHeader });
  }

  getUserSportsPartnerShipsDetails(userid) {
    return this.http.get<any>(this.Base_Url + 'sports/getUserSportsPartnerShipsDetails/' + userid, { headers: this.reqHeader });
  }


  getAllUsersList() {
    return this.http.get<any>(this.Base_Url + 'user/usersList', { headers: this.reqHeader });
  }
  
  getChildList(data){
    return this.http.post<any>(this.Base_Url + 'user/getUsersList' , data, { headers: this.reqHeader });
  }

  getUserChildDetail(id, data) {
    return this.http.post<any>(this.Base_Url + 'user/userDetailsWithChildLevelDetails/' + id, data, { headers: this.reqHeader });
  }


  changePassword(id, data) {
    return this.http.post<any>(this.Base_Url + 'user/updateForChangePasswordAfterLogin/' + id, data, { headers: this.reqHeader });
  }

  updatePassword( data) {
    return this.http.post<any>(this.Base_Url + 'user/updatePassword', data, { headers: this.reqHeader });
  }
  lockUserAccount(id, data) {
    return this.http.post<any>(this.Base_Url + 'user/lockAccountOfUser/' + id, data, { headers: this.reqHeader });
  }

  passwordHistory(data) {
    return this.http.post<any>(this.Base_Url + 'user/getPasswordChangedHistory', data, { headers: this.reqHeader });
  }
  // updateTransactionPassword(id, data) {
  //   return this.http.post<any>(this.Base_Url + 'user/updateTransactionPasswordOfUser/'+id,data, { headers: this.reqHeader });
  // }


  closeAndReOpenAccountOfUserAndTheirChilds(id, data) {
    return this.http.post<any>(this.Base_Url + 'user/closeAndReOpenAccountOfUserAndTheirChilds/' + id, data, { headers: this.reqHeader });
  }


  getClosedUsersList(id, data) {

    return this.http.post<any>(this.Base_Url + 'user/getClosedUsersList/' + id, data, { headers: this.reqHeader });

  }


  getClosedUserTotalCount(id) {

    return this.http.get<any>(this.Base_Url + 'user/totalNumberOfClosedUser/' + id, { headers: this.reqHeader });
  }


  addUser(userForm) {
    return this.http.post<any>(this.Base_Url + 'user/register', userForm, { headers: this.reqHeader });
  }


  checkUserName(user_name) {

    return this.http.post<any>(this.Base_Url + 'user/checkUserName', user_name, { headers: this.reqHeader });
  }
  getUserDetailsByUserId(id) {
    return this.http.get<any>(this.Base_Url + 'user/userdetails/' + id, { headers: this.reqHeader });
  }
  getUserDetailsWithParentDetails(id) {
    return this.http.get<any>(this.Base_Url + 'user/getUserDetailsWithParentDetails/' + id, { headers: this.reqHeader });
  }

  updateUser(userid, userForm) {
    return this.http.post<any>(this.Base_Url + 'user/updateUserDetails/' + userid, userForm, { headers: this.reqHeader });
  }
  depositWithdrawl(params) {
    return this.http.post<any>(this.Base_Url + 'account/chipInOut', params, { headers: this.reqHeader });
  }
  changeChildPassword(params) {
    return this.http.post<any>(this.Base_Url + 'user/updateChildPassword', params, { headers: this.reqHeader });
  }

  getPartnershipListByUserId(params) {
    return this.http.post<any>(this.Base_Url + 'user/getPartnershipListByUserId', params, { headers: this.reqHeader });
  }


  updatePartnershipList(params) {
    return this.http.post<any>(this.Base_Url + 'user/updatePartnershipList', params, { headers: this.reqHeader });
  }

  updateUserBettingLockUnlock(userid) {
    return this.http.post<any>(this.Base_Url + 'user/updateUserStatusBettingLockUnlock', { user_id: userid }, { headers: this.reqHeader });
  }
  updateUserStatusFancyBetLock(request) {
    return this.http.post<any>(this.Base_Url + 'user/updateUserStatusFancyBetLock', request, { headers: this.reqHeader });
  }

  updateUserStatusFancyBetUnlock(request) {
    return this.http.post<any>(this.Base_Url + 'user/updateUserStatusFancyBetUnlock', request, { headers: this.reqHeader });
  }

  // getSportSetting(request) {
  //   return this.http.post<any>(this.Base_Url + 'sports/getUserSportsWiseSettingDetails', request, { headers: this.reqHeader });
  // }
  getSportSetting(request) {
    return this.http.post<any>(this.Base_Url + 'userSettings/getSportsWise', request, { headers: this.reqHeader });
  }
  getOnlineUsersList(userid) {
    return this.http.post<any>(this.Base_Url + 'user/getOnlineUsersList', { userid: userid }, { headers: this.reqHeader });
  }

  // updateSportWiseSettingDetails(request) {
  //   return this.http.post<any>(this.Base_Url + 'sports/updateSportWiseSettingDetails', request, { headers: this.reqHeader });
  // }
  updateSportWiseSettingDetails(request) {
    return this.http.post<any>(this.Base_Url + 'userSettings/update', request, { headers: this.reqHeader });
  }

  updateUseIsSocket() {
    return this.http.get<any>(this.Base_Url + 'globalsetting/updateUseSocketStatus', { headers: this.reqHeader });
  }


  getGlobalSettings() {
    return this.http.get<any>(this.Base_Url + 'globalsetting/getGlobalSettingDetails', { headers: this.reqHeader });
  }

  getUserRawPassword(request) {
    return this.http.post<any>(this.Base_Url + 'user/getRawPasswordOfUser', request, { headers: this.reqHeader });
  }

  getUserBalance(id) {
    return this.http.post<any>(this.Base_Url + 'user/getBalanceCRef',  id, { headers: this.reqHeader });
  }
  getUserMatchStack(id) {
    return this.http.post<any>(this.Base_Url + 'user/getUserMatchStack', { "userid": id }, { headers: this.reqHeader });
  }

  updateUserMatchStack(request) {
    return this.http.post<any>(this.Base_Url + 'user/updateMatchStack', request, { headers: this.reqHeader });
  }

  allowAndNotAllowAgentsMultiLogin(request) {
    return this.http.post<any>(this.Base_Url + 'user/allowAndNotAllowAgentsMultiLogin', request, { headers: this.reqHeader });
  }

  eventCheckApi(request) {
    return this.http.post<any>(this.Base_Url + 'user/update/eventSettingsCheck', request, { headers: this.reqHeader });
  }
  getUserCommission(request) {
    return this.http.post<any>(this.Base_Url + 'user/getCommission', request, { headers: this.reqHeader });
  }
  updateUserCommission(request) {
    return this.http.post<any>(this.Base_Url + 'userSettings/update-commission', request, { headers: this.reqHeader });
  }
  updateCreditReference(request) {
    return this.http.post<any>(this.Base_Url + 'user/update', request, { headers: this.reqHeader });
  }
  updateCR(request) {
    return this.http.post<any>(this.Base_Url + 'user/updateCreditReference', request, { headers: this.reqHeader });
  }
  historyCreditReference(request) {
    return this.http.post<any>(this.Base_Url + 'user/creditReferenceLogs', request, { headers: this.reqHeader });
  }
  getAgentUserBalance(request) {
    return this.http.post<any>(this.Base_Url + 'user/getAgentBalance', request, { headers: this.reqHeader });
  }
  userActivity(param) {
    return this.http.post<any>(this.Base_Url + 'user/agentActivityList', param, { headers: this.reqHeader });
  }
  async encryptData(data) {

    try {
      return await CryptoJS.AES.encrypt(JSON.stringify(data), environment['transactionPasswordEncryptKey']).toString();
    } catch (e) {
      console.log(e);
    }
  }

  async decryptData(data) {

    try {
      const bytes = await CryptoJS.AES.decrypt(data, environment['transactionPasswordEncryptKey']);
      if (bytes.toString()) {
        return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
      }
      return data;
    } catch (e) {
      console.log(e);
    }
  }
  

}
