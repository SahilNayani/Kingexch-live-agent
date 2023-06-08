import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FancyStakeComponent } from './fancy-stake.component';

describe('FancyStakeComponent', () => {
  let component: FancyStakeComponent;
  let fixture: ComponentFixture<FancyStakeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FancyStakeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FancyStakeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
