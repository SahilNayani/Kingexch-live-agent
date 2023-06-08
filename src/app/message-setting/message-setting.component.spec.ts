import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageSettingComponent } from './message-setting.component';

describe('MessageSettingComponent', () => {
  let component: MessageSettingComponent;
  let fixture: ComponentFixture<MessageSettingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MessageSettingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MessageSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
