import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FancyResultComponent } from './fancy-result.component';

describe('FancyResultComponent', () => {
  let component: FancyResultComponent;
  let fixture: ComponentFixture<FancyResultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FancyResultComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FancyResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
