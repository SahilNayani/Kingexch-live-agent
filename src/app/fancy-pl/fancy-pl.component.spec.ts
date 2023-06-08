import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FancyPLComponent } from './fancy-pl.component';

describe('FancyPLComponent', () => {
  let component: FancyPLComponent;
  let fixture: ComponentFixture<FancyPLComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FancyPLComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FancyPLComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
