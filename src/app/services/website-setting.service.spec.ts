import { TestBed } from '@angular/core/testing';

import { WebsiteSettingService } from './website-setting.service';

describe('WebsiteSettingService', () => {
  let service: WebsiteSettingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WebsiteSettingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
