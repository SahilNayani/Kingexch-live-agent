import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteBetComponent } from './delete-bet.component';

describe('DeleteBetComponent', () => {
  let component: DeleteBetComponent;
  let fixture: ComponentFixture<DeleteBetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeleteBetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteBetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
