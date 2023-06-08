import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlUserBetSnComponent } from './pl-user-bet-sn.component';

describe('PlUserBetSnComponent', () => {
  let component: PlUserBetSnComponent;
  let fixture: ComponentFixture<PlUserBetSnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlUserBetSnComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlUserBetSnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
