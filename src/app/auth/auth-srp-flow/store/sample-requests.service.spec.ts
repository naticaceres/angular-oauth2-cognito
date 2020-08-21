import { TestBed } from '@angular/core/testing';

import { SampleRequestsService } from './sample-requests.service';

describe('SampleRequestsService', () => {
  let service: SampleRequestsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SampleRequestsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
