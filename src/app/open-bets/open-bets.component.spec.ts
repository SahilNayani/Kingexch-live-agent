import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenBetsComponent } from './open-bets.component';

describe('OpenBetsComponent', () => {
  let component: OpenBetsComponent;
  let fixture: ComponentFixture<OpenBetsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OpenBetsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OpenBetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
