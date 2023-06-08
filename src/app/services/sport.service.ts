import { Injectable, Output, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders, HttpHeaderResponse, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class SportService {
  public Base_Url = environment['adminServerUrl'];
  public token = localStorage.getItem('adminAccessToken');
  constructor(private http: HttpClient, private cookie: CookieService) { }

  reqHeader = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ` + this.token
  });
  createSport(param) {
    return this.http.post<any>(this.Base_Url + 'sports/createNewSport', param, { headers: this.reqHeader });
  }

  getAllActiveSport(param) {
    return this.http.post<any>(this.Base_Url + 'sports/getAllActiveSports', param, { headers: this.reqHeader });
  }
  updateSportsStatus(request) {
    return this.http.post<any>(this.Base_Url + 'sports/updateSportsStatus', request, { headers: this.reqHeader });
  }
  getAllSportsList(request) {
    return this.http.post<any>(this.Base_Url + 'sports/getSports', request, { headers: this.reqHeader });
  }
  getSeriesList(request) {
    return this.http.post<any>(this.Base_Url + 'series/getSeries', request, { headers: this.reqHeader });
  }
  getOnlineSeries(request) {
    return this.http.post<any>(this.Base_Url + 'series/getOnlineSeries', request, { headers: this.reqHeader });
  }
  createSeries(request) {
    return this.http.post<any>(this.Base_Url + 'series/createSeries', request, { headers: this.reqHeader });
  }
  updateSeries(request) {
    return this.http.post<any>(this.Base_Url + 'series/updateSeriesStatus', request, { headers: this.reqHeader });
  }
  getHomeMatchesList(request) {
    return this.http.post<any>(this.Base_Url + 'match/homeMatches', request, { headers: this.reqHeader });
  }
  runnerList(request) {
    return this.http.post<any>(this.Base_Url + 'match/homeMatchesRunners', request, { headers: this.reqHeader });
  }
  getOnlineMatch(request) {
    return this.http.post<any>(this.Base_Url + 'match/getOnlineMatch', request, { headers: this.reqHeader });
  }
  createMatch(request) {
    return this.http.post<any>(this.Base_Url + 'match/createMatch', request, { headers: this.reqHeader });
  }
  updateMatchStatus(request) {
    return this.http.post<any>(this.Base_Url + 'match/updateMatchStatus', request, { headers: this.reqHeader });
  }
  getOnlineMarket(request) {
    return this.http.post<any>(this.Base_Url + 'market/getOnlineMarket', request, { headers: this.reqHeader });
  }
  createMarket(request) {
    return this.http.post<any>(this.Base_Url + 'market/createMarket', request, { headers: this.reqHeader });
  }
  updateMarketStatus(request) {
    return this.http.post<any>(this.Base_Url + 'market/updateMarketStatus', request, { headers: this.reqHeader });
  }
  getFancyList(request) {
    return this.http.post<any>(this.Base_Url + 'fancy/getOnlineApiFancy', request, { headers: this.reqHeader });
  }

  createFancy(request) {
    return this.http.post<any>(this.Base_Url + 'fancy/createFancy', request, { headers: this.reqHeader });
  }
  enableFancy(request) {
    return this.http.post<any>(this.Base_Url + 'match/enableFancy', request, { headers: this.reqHeader });
  }
  updateFancyStatus(request) {
    return this.http.post<any>(this.Base_Url + 'fancy/updateFancyStatus', request, { headers: this.reqHeader });
  }

  showFancyList(request) {
    return this.http.post<any>(this.Base_Url + 'fancy/getFancies', request, { headers: this.reqHeader });
  }
  showFancyListRunner(request) {
    return this.http.post<any>(this.Base_Url + 'fancy/getFancyLiveData', request, { headers: this.reqHeader });
  }
  matchDetails(request) {
    return this.http.post<any>(this.Base_Url + 'match/matchDetails', request, { headers: this.reqHeader });
  }
  matchDetailRunners(request) {
    return this.http.post<any>(this.Base_Url + 'match/matchDetailsRunners', request, { headers: this.reqHeader });
  }
  getBet(request) {
    return this.http.post<any>(this.Base_Url + 'bet/bets', request, { headers: this.reqHeader });
  }
  teamPosition(request) {
    return this.http.post<any>(this.Base_Url + 'bet/getTeamPosition', request, { headers: this.reqHeader });
  }
  deleteBet(request) {
    return this.http.post<any>(this.Base_Url + 'bet/deleteBet', request, { headers: this.reqHeader });
  }
  matchResultList(request) {
    return this.http.post<any>(this.Base_Url + 'market/results', request, { headers: this.reqHeader });
  }
  matchRollbackList(request) {
    return this.http.post<any>(this.Base_Url + 'market/results-rollback', request, { headers: this.reqHeader });
  }
  matchResult(request) {
    return this.http.post<any>(this.Base_Url + 'bet/oddsResult', request, { headers: this.reqHeader });
  }
  winnerResult(request) {
    return this.http.get<any>('https://api.ajioexch.com/api/v2/getOddsListsV9?market_id=' + request, { headers: this.reqHeader });
  }
  matchRollback(request) {
    return this.http.post<any>(this.Base_Url + 'bet/oddsRollback', request, { headers: this.reqHeader });
  }
  matchAbonded(request) {
    return this.http.post<any>(this.Base_Url + 'bet/oddsAbandoned', request, { headers: this.reqHeader });
  }
  getFancyPosition(request) {
    return this.http.post<any>(this.Base_Url + 'fancy/getRunTimeFancyPosition', request, { headers: this.reqHeader });
  }
  getFancyLiability(request) {
    return this.http.post<any>(this.Base_Url + 'bet/getFancyLiability', request, { headers: this.reqHeader });
  }
  fancyResult(request) {
    return this.http.post<any>(this.Base_Url + 'bet/sessionResult', request, { headers: this.reqHeader });
  }
  fancyResultAbonded(request) {
    return this.http.post<any>(this.Base_Url + 'bet/sessionAbandoned', request, { headers: this.reqHeader });
  }
  sessionRollback(request) {
    return this.http.post<any>(this.Base_Url + 'bet/sessionRollback', request, { headers: this.reqHeader });
  }
  closeCasino(request) {
    return this.http.post<any>(this.Base_Url + 'match/stopCasino', request, { headers: this.reqHeader });
  }
  getSocketStatus() {
    return this.http.get<any>(this.Base_Url + 'globalsetting/getSocketStatus', { headers: this.reqHeader });
  }
  getMatchesForResult() {
    return this.http.get<any>(this.Base_Url + 'fancy/getMatchesForResult', { headers: this.reqHeader });
  }
  getfancyResult(request) {
    return this.http.post<any>(this.Base_Url + 'fancy/results', request, { headers: this.reqHeader });
  }
  getExposure(request) {
    return this.http.post<any>(this.Base_Url + 'bet/getExposures', request, { headers: this.reqHeader });
  }
  getExposureRoute(request) {
    return this.http.post<any>(this.Base_Url + 'market/getRawEvents', request, { headers: this.reqHeader });
  }
  getFancyMatchList(request) {
    return this.http.post<any>(this.Base_Url + 'event/fancy-match-lists', request, { headers: this.reqHeader });
  }
  marketPosition(request) {
    return this.http.post<any>(this.Base_Url + 'market/getMarketAgentUserPositions', request, { headers: this.reqHeader });
  }
  getMarketSetting(request) {
    return this.http.post<any>(this.Base_Url + 'event/getLimites', request, { headers: this.reqHeader });
  }
  updateMarketSetting(request) {
    return this.http.post<any>(this.Base_Url + 'event/updateLimites', request, { headers: this.reqHeader });
  }
  getMarketSettingValues(request) {
    return this.http.post<any>(this.Base_Url + 'event/getEventsLimit', request, { headers: this.reqHeader });
  }
  visible(request) {
    return this.http.post<any>(this.Base_Url + 'event/update', request, { headers: this.reqHeader });
  }
  showParentList(request) {
    return this.http.post<any>(this.Base_Url + 'user/showAgents', request, { headers: this.reqHeader });
  }
}
