import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfitLossMatchUserComponent } from './profit-loss-match-user.component';

describe('ProfitLossMatchUserComponent', () => {
  let component: ProfitLossMatchUserComponent;
  let fixture: ComponentFixture<ProfitLossMatchUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProfitLossMatchUserComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfitLossMatchUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
