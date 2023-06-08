import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlUserwiseComponent } from './pl-userwise.component';

describe('PlUserwiseComponent', () => {
  let component: PlUserwiseComponent;
  let fixture: ComponentFixture<PlUserwiseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlUserwiseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlUserwiseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
