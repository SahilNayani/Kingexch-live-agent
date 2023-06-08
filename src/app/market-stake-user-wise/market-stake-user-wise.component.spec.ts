import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketStakeUserWiseComponent } from './market-stake-user-wise.component';

describe('MarketStakeUserWiseComponent', () => {
  let component: MarketStakeUserWiseComponent;
  let fixture: ComponentFixture<MarketStakeUserWiseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MarketStakeUserWiseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MarketStakeUserWiseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
