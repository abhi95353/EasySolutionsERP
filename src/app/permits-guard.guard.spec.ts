import { TestBed } from '@angular/core/testing';

import { PermitsGuardGuard } from './permits-guard.guard';

describe('PermitsGuardGuard', () => {
  let guard: PermitsGuardGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(PermitsGuardGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
