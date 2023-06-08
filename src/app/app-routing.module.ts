import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UserDataComponent } from './user-data/user-data.component';
import { AddUserComponent } from './add-user/add-user.component';
import { AddAgentComponent } from './add-agent/add-agent.component';
import { WebsiteSettingComponent } from './website-setting/website-setting.component';
import { importMarketComponent } from './import-market/import-market.component';
import { BlockMarketComponent } from './block-market/block-market.component';
import { MatchDetailComponent } from './match-detail/match-detail.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { OnlineUserComponent } from './online-user/online-user.component';
import { ClosedUsersAccountsComponent } from './closed-users-accounts/closed-users-accounts.component';
import { ClosedUserComponent } from './closed-user/closed-user.component';
import { AccountInfoComponent } from './account-info/account-info.component';
import { AccountStatementComponent } from './account-statement/account-statement.component';
import { ChipSummaryComponent } from './chip-summary/chip-summary.component';
import { BetHistoryComponent } from './bet-history/bet-history.component';
import { LiveBetHistoryComponent } from './live-bet-history/live-bet-history.component';
import { DeleteBetComponent } from './delete-bet/delete-bet.component';
import { ProfitLossComponent } from './profit-loss/profit-loss.component';
import { MyMarketComponent } from './my-market/my-market.component';
import { DownlineReportComponent } from './downline-report/downline-report.component';
import { HomeComponent } from './home/home.component';
import { MessageSettingComponent } from './message-setting/message-setting.component';
import { AuthCheckGuard } from './auth-guard-helper/auth-check.guard';
import { InplayComponent } from './inplay/inplay.component';
import { MatchResultComponent } from './match-result/match-result.component';
import { FancyResultComponent } from './fancy-result/fancy-result.component';
import { MatchRollbackComponent } from './match-rollback/match-rollback.component';
import { FancyResultRollbackComponent } from './fancy-result-rollback/fancy-result-rollback.component';
import { ViewBetsComponent } from './view-bets/view-bets.component';
import { OpenBetsComponent } from './open-bets/open-bets.component';
import { SettledBetsComponent } from './settled-bets/settled-bets.component';
import { SportPlComponent } from './sport-pl/sport-pl.component';
import {  CasinoComponent } from './casino/casino.component';
import { FancyPLComponent } from './fancy-pl/fancy-pl.component';
import { FancyStakeComponent } from './fancy-stake/fancy-stake.component';
import { FancyStakeUserWiseComponent } from './fancy-stake-user-wise/fancy-stake-user-wise.component'; 
import { RentalLoginComponent } from './rental-login/rental-login.component';
import { MaxLoginComponent  } from './max-login/max-login.component';
import { MarketStakeUserWiseComponent } from './market-stake-user-wise/market-stake-user-wise.component';
import { MasterBankingComponent } from './master-banking/master-banking.component';
import { BankingComponent } from './banking/banking.component';
import { CommissionComponent } from './commission/commission.component';
import { DownlinwPlComponent } from './downlinw-pl/downlinw-pl.component';
import { EventPlComponent } from './event-pl/event-pl.component';
import { PasswordHistoryComponent } from './password-history/password-history.component';
import { PlMatchwiseComponent } from './pl-matchwise/pl-matchwise.component';
import { PlMarketwiseComponent } from './pl-marketwise/pl-marketwise.component';
import { PlUserwiseComponent } from './pl-userwise/pl-userwise.component';
import { PlUserBetComponent } from './pl-user-bet/pl-user-bet.component';
import { ProfitLossMatchUserComponent } from './profit-loss-match-user/profit-loss-match-user.component';
import { ProfitLossMarketUserComponent } from './profit-loss-market-user/profit-loss-market-user.component';
import { ProfitLossBetUserComponent } from './profit-loss-bet-user/profit-loss-bet-user.component';
import { PlUserBetSnComponent } from './pl-user-bet-sn/pl-user-bet-sn.component';
import { ProfitLossUserBetSnComponent } from './profit-loss-user-bet-sn/profit-loss-user-bet-sn.component'
const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  // { path: 'login', component: RentalLoginComponent },
  // { path: 'login', component: MaxLoginComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthCheckGuard] },
  { path: 'dashboard/:sportName', component: DashboardComponent, canActivate: [AuthCheckGuard] },
  { path: 'user', component: UserDataComponent, canActivate: [AuthCheckGuard] },
  { path: 'home/:sportId/:seriesId', component: HomeComponent, canActivate: [AuthCheckGuard] },
  { path: 'master', component: AddUserComponent, canActivate: [AuthCheckGuard] },
  { path: 'addChild-user/:userid/:userTypeId', component: AddUserComponent, canActivate: [AuthCheckGuard] },
  { path: 'add-agent', component: AddAgentComponent, canActivate: [AuthCheckGuard] },
  { path: 'addChild-agent/:userid/:userTypeId', component: AddAgentComponent, canActivate: [AuthCheckGuard] },
  { path: 'website-setting', component: WebsiteSettingComponent, canActivate: [AuthCheckGuard] },
  { path: 'import-market', component: importMarketComponent, canActivate: [AuthCheckGuard] },
  { path: 'block-market', component: BlockMarketComponent, canActivate: [AuthCheckGuard] },
  { path: 'user-block-market/:userid/:userTypeId', component: BlockMarketComponent, canActivate: [AuthCheckGuard] },
  { path: 'match-detail', component: MatchDetailComponent, canActivate: [AuthCheckGuard] },
  { path: 'change-password', component: ChangePasswordComponent, canActivate: [AuthCheckGuard] },
  { path: 'online-user', component: OnlineUserComponent, canActivate: [AuthCheckGuard] },
  { path: 'online-user/:userid/:userTypeId', component: OnlineUserComponent, canActivate: [AuthCheckGuard] },
  { path: 'closed-user', component: ClosedUserComponent, canActivate: [AuthCheckGuard] },
  { path: 'account-info/:userid/:userTypeId', component: AccountInfoComponent, canActivate: [AuthCheckGuard] },
  { path: 'statement', component: AccountStatementComponent, canActivate: [AuthCheckGuard] },
  { path: 'statement/:id/:userTypeId', component: AccountStatementComponent, canActivate: [AuthCheckGuard] },
  { path: 'child-statement/:userid', component: AccountStatementComponent, canActivate: [AuthCheckGuard] },
  { path: 'chip-summary', component: ChipSummaryComponent, canActivate: [AuthCheckGuard] },
  { path: 'bet-history', component: BetHistoryComponent, canActivate: [AuthCheckGuard] },
  { path: 'live-bet', component: LiveBetHistoryComponent, canActivate: [AuthCheckGuard] },
  { path: 'delete-bet', component: DeleteBetComponent, canActivate: [AuthCheckGuard] },
  { path: 'profit-loss', component: ProfitLossComponent, canActivate: [AuthCheckGuard] },
  { path: 'profit-loss/:userId/:userTypeId', component: ProfitLossComponent, canActivate: [AuthCheckGuard] },
  { path: 'my-market', component: MyMarketComponent, canActivate: [AuthCheckGuard] },
  { path: 'downline-report/:userId/:userTypeId', component: DownlineReportComponent, canActivate: [AuthCheckGuard] },
  { path: 'message-setting', component: MessageSettingComponent, canActivate: [AuthCheckGuard] },
  { path: 'inplay', component: InplayComponent, canActivate: [AuthCheckGuard] },
  { path: 'match-result', component: MatchResultComponent, canActivate: [AuthCheckGuard] },
  { path: 'fancy-result', component: FancyResultComponent, canActivate: [AuthCheckGuard] },
  { path: 'match-rollback', component: MatchRollbackComponent, canActivate: [AuthCheckGuard] },
  { path: 'fancy-rollback', component: FancyResultRollbackComponent, canActivate: [AuthCheckGuard] },
  { path: 'viewBet/:matchId/:marketId/:type/:sportName/:seriesName/:matchName', component: ViewBetsComponent, canActivate: [AuthCheckGuard] },
  { path: 'viewBet/:matchId/:marketId/:type/:sportName/:seriesName/:matchName/:marketName/:id', component: ViewBetsComponent, canActivate: [AuthCheckGuard] },
  { path: 'viewBet/:matchId/:marketId/:type/:matchName/:id', component: ViewBetsComponent, canActivate: [AuthCheckGuard] },
  { path: 'open-bet', component: OpenBetsComponent, canActivate: [AuthCheckGuard] },
  { path: 'open-bet/:userId/:userTypeId', component: OpenBetsComponent, canActivate: [AuthCheckGuard] },
  { path: 'settled-bet', component: SettledBetsComponent, canActivate: [AuthCheckGuard] },
  { path: 'sport-pl', component: SportPlComponent, canActivate: [AuthCheckGuard] },
  { path: 'casino', component: CasinoComponent, canActivate: [AuthCheckGuard] },
  { path: 'fancypl', component: FancyPLComponent, canActivate: [AuthCheckGuard] },
  { path: 'fancyStake', component: FancyStakeComponent, canActivate: [AuthCheckGuard] },
  { path: 'marketStake', component: MarketStakeUserWiseComponent, canActivate: [AuthCheckGuard] },
  { path: 'banking', component: BankingComponent, canActivate: [AuthCheckGuard] },
  { path: 'masterBanking', component: MasterBankingComponent, canActivate: [AuthCheckGuard] },
  { path: 'fancyStakeUser/:matchId/:marketId/:matchName', component: FancyStakeUserWiseComponent, canActivate: [AuthCheckGuard] },
  { path: 'sport-pl/:event_id/:type/:matchId/:sportName/:seriesName/:matchName/:eventName', component: SportPlComponent, canActivate: [AuthCheckGuard] },
  { path: 'sport-pl/:event_id/:type/:matchId/:sportName/:userId', component: SportPlComponent, canActivate: [AuthCheckGuard] },
  { path: 'commission', component: CommissionComponent, canActivate: [AuthCheckGuard] },
  { path: 'downpl', component: DownlinwPlComponent, canActivate: [AuthCheckGuard] },
  { path: 'eventpl', component: EventPlComponent, canActivate: [AuthCheckGuard] },
  { path: 'eventpl/:userId', component: EventPlComponent, canActivate: [AuthCheckGuard] },
  { path: 'history', component: PasswordHistoryComponent, canActivate: [AuthCheckGuard] },
  { path: 'plMatchwise/:sportId/:sportName/:fromDate/:toDate/:typeId', component: PlMatchwiseComponent, canActivate: [AuthCheckGuard] },
  { path: 'plMatchwise/:sportId/:sportName/:fromDate/:toDate/:userId/:typeId', component: PlMatchwiseComponent, canActivate: [AuthCheckGuard] },
  { path: 'plMatchUserwise/:sportId/:sportName/:fromDate/:toDate/:userId/:typeId', component: ProfitLossMatchUserComponent, canActivate: [AuthCheckGuard] },
  { path: 'plMarketwise/:matchId/:matchName/:typeId/:sportId/:fromDate/:toDate', component: PlMarketwiseComponent, canActivate: [AuthCheckGuard] },
  { path: 'plMarketwise/:matchId/:matchName/:typeId/:userId/:sportId/:fromDate/:toDate', component: PlMarketwiseComponent, canActivate: [AuthCheckGuard] },
  { path: 'plMarketUserwise/:matchId/:matchName/:typeId/:userId/:sportId/:fromDate/:toDate', component: ProfitLossMarketUserComponent, canActivate: [AuthCheckGuard] },
  { path: 'plUserwise/:sportId/:marketId/:type', component: PlUserwiseComponent, canActivate: [AuthCheckGuard] },
  { path: 'plUserBet/:matchId/:marketId/:matchName/:sportName/:userId/:type', component: PlUserBetComponent, canActivate: [AuthCheckGuard] },
  { path: 'plmarketUserBet/:matchId/:marketId/:matchName/:sportName/:userId/:type', component: ProfitLossBetUserComponent, canActivate: [AuthCheckGuard] },
  { path: 'plSnUserBet/:marketId/:sportName/:matchName/:marketName/:userId', component: PlUserBetSnComponent, canActivate: [AuthCheckGuard] },
  { path: 'profitLossSnUserBet/:matchId/:marketId/:matchName/:sportName/:userId/:type/:marketName', component: PlUserBetSnComponent, canActivate: [AuthCheckGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    relativeLinkResolution: 'legacy'
})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
