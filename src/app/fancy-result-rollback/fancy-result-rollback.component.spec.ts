import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FancyResultRollbackComponent } from './fancy-result-rollback.component';

describe('FancyResultRollbackComponent', () => {
  let component: FancyResultRollbackComponent;
  let fixture: ComponentFixture<FancyResultRollbackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FancyResultRollbackComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FancyResultRollbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
