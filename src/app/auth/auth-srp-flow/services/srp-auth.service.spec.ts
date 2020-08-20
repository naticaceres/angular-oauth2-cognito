import { TestBed } from '@angular/core/testing';

import { SrpAuthService } from './srp-auth.service';

describe('CustomAuthService', () => {
  let service: SrpAuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SrpAuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
