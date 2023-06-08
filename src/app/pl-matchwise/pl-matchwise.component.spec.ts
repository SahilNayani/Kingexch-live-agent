import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlMatchwiseComponent } from './pl-matchwise.component';

describe('PlMatchwiseComponent', () => {
  let component: PlMatchwiseComponent;
  let fixture: ComponentFixture<PlMatchwiseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlMatchwiseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlMatchwiseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
