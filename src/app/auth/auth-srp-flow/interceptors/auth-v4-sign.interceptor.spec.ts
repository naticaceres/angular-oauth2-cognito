import { TestBed } from '@angular/core/testing';

import { AuthV4SignInterceptor } from './auth-v4-sign.interceptor';

describe('AuthV4SignInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      AuthV4SignInterceptor
      ]
  }));

  it('should be created', () => {
    const interceptor: AuthV4SignInterceptor = TestBed.inject(AuthV4SignInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
