import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfitLossMarketUserComponent } from './profit-loss-market-user.component';

describe('ProfitLossMarketUserComponent', () => {
  let component: ProfitLossMarketUserComponent;
  let fixture: ComponentFixture<ProfitLossMarketUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProfitLossMarketUserComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfitLossMarketUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
