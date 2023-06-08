import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewBetsComponent } from './view-bets.component';

describe('ViewBetsComponent', () => {
  let component: ViewBetsComponent;
  let fixture: ComponentFixture<ViewBetsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewBetsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewBetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
