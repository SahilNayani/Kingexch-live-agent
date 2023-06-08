import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PasswordHistoryComponent } from './password-history.component';

describe('PasswordHistoryComponent', () => {
  let component: PasswordHistoryComponent;
  let fixture: ComponentFixture<PasswordHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PasswordHistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PasswordHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
