import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DownlineReportComponent } from './downline-report.component';

describe('DownlineReportComponent', () => {
  let component: DownlineReportComponent;
  let fixture: ComponentFixture<DownlineReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DownlineReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DownlineReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
