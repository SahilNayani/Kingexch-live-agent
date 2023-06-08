import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClosedUsersAccountsComponent } from './closed-users-accounts.component';

describe('ClosedUsersAccountsComponent', () => {
  let component: ClosedUsersAccountsComponent;
  let fixture: ComponentFixture<ClosedUsersAccountsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClosedUsersAccountsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClosedUsersAccountsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
