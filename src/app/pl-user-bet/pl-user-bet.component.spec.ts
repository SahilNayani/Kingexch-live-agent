import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlUserBetComponent } from './pl-user-bet.component';

describe('PlUserBetComponent', () => {
  let component: PlUserBetComponent;
  let fixture: ComponentFixture<PlUserBetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlUserBetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlUserBetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
