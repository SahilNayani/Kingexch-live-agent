import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatchRollbackComponent } from './match-rollback.component';

describe('MatchRollbackComponent', () => {
  let component: MatchRollbackComponent;
  let fixture: ComponentFixture<MatchRollbackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MatchRollbackComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MatchRollbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
