import { TestBed } from '@angular/core/testing';

import { PermitsAccountsGuard } from './permits-accounts.guard';

describe('PermitsAccountsGuard', () => {
  let guard: PermitsAccountsGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(PermitsAccountsGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
