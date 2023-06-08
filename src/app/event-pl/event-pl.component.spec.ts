import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventPlComponent } from './event-pl.component';

describe('EventPlComponent', () => {
  let component: EventPlComponent;
  let fixture: ComponentFixture<EventPlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EventPlComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EventPlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
