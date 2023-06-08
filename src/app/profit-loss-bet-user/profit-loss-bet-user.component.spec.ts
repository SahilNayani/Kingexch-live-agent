import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfitLossBetUserComponent } from './profit-loss-bet-user.component';

describe('ProfitLossBetUserComponent', () => {
  let component: ProfitLossBetUserComponent;
  let fixture: ComponentFixture<ProfitLossBetUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProfitLossBetUserComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfitLossBetUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
