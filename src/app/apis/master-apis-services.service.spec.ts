import { TestBed } from '@angular/core/testing';

import { MasterAPIsServicesService } from './master-apis-services.service';

describe('MasterAPIsServicesService', () => {
  let service: MasterAPIsServicesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MasterAPIsServicesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
