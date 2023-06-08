import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlMarketwiseComponent } from './pl-marketwise.component';

describe('PlMarketwiseComponent', () => {
  let component: PlMarketwiseComponent;
  let fixture: ComponentFixture<PlMarketwiseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlMarketwiseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlMarketwiseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
