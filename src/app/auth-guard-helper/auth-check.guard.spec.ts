import { TestBed } from '@angular/core/testing';

import { AuthCheckGuard } from './auth-check.guard';

describe('AuthCheckGuard', () => {
  let guard: AuthCheckGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(AuthCheckGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
