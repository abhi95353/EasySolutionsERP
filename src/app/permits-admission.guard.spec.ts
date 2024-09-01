import { TestBed } from '@angular/core/testing';

import { PermitsAdmissionGuard } from './permits-admission.guard';

describe('PermitsAdmissionGuard', () => {
  let guard: PermitsAdmissionGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(PermitsAdmissionGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
