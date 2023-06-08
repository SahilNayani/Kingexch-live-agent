import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClosedUserComponent } from './closed-user.component';

describe('ClosedUserComponent', () => {
  let component: ClosedUserComponent;
  let fixture: ComponentFixture<ClosedUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClosedUserComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClosedUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
