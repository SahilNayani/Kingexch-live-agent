import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FancyStakeUserWiseComponent } from './fancy-stake-user-wise.component';

describe('FancyStakeUserWiseComponent', () => {
  let component: FancyStakeUserWiseComponent;
  let fixture: ComponentFixture<FancyStakeUserWiseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FancyStakeUserWiseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FancyStakeUserWiseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
