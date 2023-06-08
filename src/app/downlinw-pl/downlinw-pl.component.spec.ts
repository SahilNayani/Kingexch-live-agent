import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DownlinwPlComponent } from './downlinw-pl.component';

describe('DownlinwPlComponent', () => {
  let component: DownlinwPlComponent;
  let fixture: ComponentFixture<DownlinwPlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DownlinwPlComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DownlinwPlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
