import { ComponentFixture, TestBed } from '@angular/core/testing';

import { importMarketComponent } from './import-market.component';

describe('importMarketComponent', () => {
  let component: importMarketComponent;
  let fixture: ComponentFixture<importMarketComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ importMarketComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(importMarketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
