import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfitLossUserBetSnComponent } from './profit-loss-user-bet-sn.component';

describe('ProfitLossUserBetSnComponent', () => {
  let component: ProfitLossUserBetSnComponent;
  let fixture: ComponentFixture<ProfitLossUserBetSnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProfitLossUserBetSnComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfitLossUserBetSnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
