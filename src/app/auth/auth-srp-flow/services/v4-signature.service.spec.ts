import { TestBed } from '@angular/core/testing';

import { V4SignatureService } from './v4-signature.service';

describe('V4SignatureService', () => {
  let service: V4SignatureService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(V4SignatureService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
