import { BrowserModule,Title } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { OrderModule } from 'ngx-order-pipe';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { LoginComponent } from './login/login.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UserDataComponent } from './user-data/user-data.component';
import { AddUserComponent } from './add-user/add-user.component';
import { AddAgentComponent } from './add-agent/add-agent.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { WebsiteSettingComponent } from './website-setting/website-setting.component';
import { importMarketComponent } from './import-market/import-market.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BlockMarketComponent } from './block-market/block-market.component';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { NgSelectModule } from '@ng-select/ng-select';
import { CookieService } from 'ngx-cookie-service';
import { MatchDetailComponent } from './match-detail/match-detail.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
// import { SweetAlert2Module } from "@sweetalert2/ngx-sweetalert2";
import { DataTablesModule } from 'angular-datatables';
import { NgxPaginationModule } from 'ngx-pagination';
import { OnlineUserComponent } from './online-user/online-user.component';
import { ClosedUsersAccountsComponent } from './closed-users-accounts/closed-users-accounts.component';
import { NgBootstrapFormValidationModule } from 'ng-bootstrap-form-validation';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ClosedUserComponent } from './closed-user/closed-user.component';
import { AccountInfoComponent } from './account-info/account-info.component';
import { AccountStatementComponent } from './account-statement/account-statement.component';
import { ChipSummaryComponent } from './chip-summary/chip-summary.component';
import { BetHistoryComponent } from './bet-history/bet-history.component';
import { LiveBetHistoryComponent } from './live-bet-history/live-bet-history.component';
import { DeleteBetComponent } from './delete-bet/delete-bet.component';
import { ProfitLossComponent } from './profit-loss/profit-loss.component';
import { MyMarketComponent } from './my-market/my-market.component';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { DatepickerModule } from 'ngx-bootstrap/datepicker';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { DatetimePopupModule } from 'ngx-bootstrap-datetime-popup';
import { ErrorInterceptor } from './helper/error.interceptor';
import { InsertValidationErrorMessagePipe } from './app-validation/errorMessageDisplay.pipe';
import { DownlineReportComponent } from './downline-report/downline-report.component';
import { HomeComponent } from './home/home.component';
import { MessageSettingComponent } from './message-setting/message-setting.component';
import { DirectiveModule } from './directives/directive.module';
import { UserIdleModule } from 'angular-user-idle';
import { NgHttpLoaderModule } from 'ng-http-loader';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatMenuModule } from '@angular/material/menu';
import { InplayComponent } from './inplay/inplay.component';
import { SearchPipe } from './pipes/search.pipe';
import { ClipboardModule } from 'ngx-clipboard';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { MatchResultComponent } from './match-result/match-result.component';
import { FancyResultComponent } from './fancy-result/fancy-result.component';
import { MatchRollbackComponent } from './match-rollback/match-rollback.component';
import { FancyResultRollbackComponent } from './fancy-result-rollback/fancy-result-rollback.component';
import { ViewBetsComponent } from './view-bets/view-bets.component';
import { OwlDateTimeModule, OwlNativeDateTimeModule, OWL_DATE_TIME_FORMATS, OWL_DATE_TIME_LOCALE } from 'ng-pick-datetime';
import { OpenBetsComponent } from './open-bets/open-bets.component';
import { SettledBetsComponent } from './settled-bets/settled-bets.component';
import { SportPlComponent } from './sport-pl/sport-pl.component';
import { CasinoComponent } from './casino/casino.component';
import {DatePipe} from '@angular/common';
import { FancyPLComponent } from './fancy-pl/fancy-pl.component';
import { FancyStakeComponent } from './fancy-stake/fancy-stake.component';
import { FooterComponent } from './footer/footer.component'; 
import { FancyStakeUserWiseComponent } from './fancy-stake-user-wise/fancy-stake-user-wise.component';
import { RentalLoginComponent } from './rental-login/rental-login.component';
import { MaxLoginComponent } from './max-login/max-login.component';
import { MarketStakeUserWiseComponent } from './market-stake-user-wise/market-stake-user-wise.component';
import { BankingComponent } from './banking/banking.component';
import { MasterBankingComponent } from './master-banking/master-banking.component';
import { CommissionComponent } from './commission/commission.component';
import { DownlinwPlComponent } from './downlinw-pl/downlinw-pl.component';
import { EventPlComponent } from './event-pl/event-pl.component';
import { PasswordHistoryComponent } from './password-history/password-history.component';
import { PlMatchwiseComponent } from './pl-matchwise/pl-matchwise.component';
import { PlMarketwiseComponent } from './pl-marketwise/pl-marketwise.component';
import { PlUserwiseComponent } from './pl-userwise/pl-userwise.component';
import { PlUserBetComponent } from './pl-user-bet/pl-user-bet.component';
import { AccountSidebarComponent } from './account-sidebar/account-sidebar.component';
import { ProfitLossMatchUserComponent } from './profit-loss-match-user/profit-loss-match-user.component';
import { ProfitLossMarketUserComponent } from './profit-loss-market-user/profit-loss-market-user.component';
import { ProfitLossBetUserComponent } from './profit-loss-bet-user/profit-loss-bet-user.component';
import { PlUserBetSnComponent } from './pl-user-bet-sn/pl-user-bet-sn.component';
import { ProfitLossUserBetSnComponent } from './profit-loss-user-bet-sn/profit-loss-user-bet-sn.component';
export const MY_CUSTOM_FORMATS = {
  fullPickerInput: { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' },
  datePickerInput: { year: 'numeric', month: 'numeric', day: 'numeric' },
  timePickerInput: { hour: 'numeric', minute: 'numeric', second: 'numeric' },
  monthYearLabel: { year: 'numeric', month: 'short' },
  dateA11yLabel: { year: 'numeric', month: 'long', day: 'numeric' },
  monthYearA11yLabel: { year: 'numeric', month: 'long' },
};
@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    LoginComponent,
    SidebarComponent,
    DashboardComponent,
    UserDataComponent,
    AddUserComponent,
    AddAgentComponent,
    WebsiteSettingComponent,
    importMarketComponent,
    BlockMarketComponent,
    MatchDetailComponent,
    ChangePasswordComponent,
    OnlineUserComponent,
    ClosedUsersAccountsComponent,
    ClosedUserComponent,
    AccountInfoComponent,
    AccountStatementComponent,
    ChipSummaryComponent,
    BetHistoryComponent,
    LiveBetHistoryComponent,
    DeleteBetComponent,
    ProfitLossComponent,
    MyMarketComponent,
    InsertValidationErrorMessagePipe,
    DownlineReportComponent,
    HomeComponent,
    MessageSettingComponent,
    InplayComponent,
    SearchPipe,
    MatchResultComponent,
    FancyResultComponent,
    MatchRollbackComponent,
    FancyResultRollbackComponent,
    ViewBetsComponent,
    OpenBetsComponent,
    SettledBetsComponent,
    SportPlComponent,
    CasinoComponent,
    FancyPLComponent,
    FancyStakeComponent,
    FooterComponent,
    FancyStakeUserWiseComponent,
    RentalLoginComponent,
    MaxLoginComponent,
    MarketStakeUserWiseComponent,
    BankingComponent,
    MasterBankingComponent,
    CommissionComponent,
    DownlinwPlComponent,
    EventPlComponent,
    PasswordHistoryComponent,
    PlMatchwiseComponent,
    PlMarketwiseComponent,
    PlUserwiseComponent,
    PlUserBetComponent,
    AccountSidebarComponent,
    ProfitLossMatchUserComponent,
    ProfitLossMarketUserComponent,
    ProfitLossBetUserComponent,
    PlUserBetSnComponent,
    ProfitLossUserBetSnComponent,
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    // UserIdleModule.forRoot({idle: 3600, timeout: 120, ping: 60}),
    AppRoutingModule,
    ModalModule.forRoot(),
    OrderModule,
    ReactiveFormsModule,
    NgbModule,
    FormsModule,
    NgBootstrapFormValidationModule.forRoot(),
    NgBootstrapFormValidationModule,
    HttpClientModule,
    NgSelectModule,
    CommonModule,
    DataTablesModule,
    NgxPaginationModule,
    BrowserAnimationsModule, // required animations module
    ToastrModule.forRoot(), // ToastrModule added
    // SweetAlert2Module.forRoot(),
    BsDropdownModule.forRoot(),
    DatepickerModule.forRoot(),
    TimepickerModule.forRoot(),
    DatetimePopupModule,
    PopoverModule.forRoot(),
    DirectiveModule,
    NgHttpLoaderModule.forRoot(),
    MatExpansionModule,
    MatMenuModule,
    ClipboardModule,
    InfiniteScrollModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule
  ],
  exports: [InsertValidationErrorMessagePipe],
  providers: [
    Title,
    DatePipe,
    CookieService,
    InsertValidationErrorMessagePipe,
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: OWL_DATE_TIME_FORMATS, useValue: MY_CUSTOM_FORMATS }
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {

}
