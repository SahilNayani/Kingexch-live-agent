import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiveBetHistoryComponent } from './live-bet-history.component';

describe('LiveBetHistoryComponent', () => {
  let component: LiveBetHistoryComponent;
  let fixture: ComponentFixture<LiveBetHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LiveBetHistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LiveBetHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
