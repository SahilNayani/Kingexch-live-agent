import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RentalLoginComponent } from './rental-login.component';

describe('RentalLoginComponent', () => {
  let component: RentalLoginComponent;
  let fixture: ComponentFixture<RentalLoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RentalLoginComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RentalLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
