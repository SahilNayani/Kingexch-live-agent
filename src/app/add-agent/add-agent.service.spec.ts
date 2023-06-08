import { TestBed } from '@angular/core/testing';

import { AddAgentService } from './add-agent.service';

describe('AddAgentService', () => {
  let service: AddAgentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AddAgentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
