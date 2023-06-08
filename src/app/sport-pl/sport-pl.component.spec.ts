import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SportPlComponent } from './sport-pl.component';

describe('SportPlComponent', () => {
  let component: SportPlComponent;
  let fixture: ComponentFixture<SportPlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SportPlComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SportPlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
