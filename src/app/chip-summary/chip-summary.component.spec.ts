import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChipSummaryComponent } from './chip-summary.component';

describe('ChipSummaryComponent', () => {
  let component: ChipSummaryComponent;
  let fixture: ComponentFixture<ChipSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChipSummaryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChipSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
