import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettledBetsComponent } from './settled-bets.component';

describe('SettledBetsComponent', () => {
  let component: SettledBetsComponent;
  let fixture: ComponentFixture<SettledBetsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SettledBetsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SettledBetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
