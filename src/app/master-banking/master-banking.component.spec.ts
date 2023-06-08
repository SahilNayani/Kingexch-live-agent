import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterBankingComponent } from './master-banking.component';

describe('MasterBankingComponent', () => {
  let component: MasterBankingComponent;
  let fixture: ComponentFixture<MasterBankingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MasterBankingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MasterBankingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
