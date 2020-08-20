import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';

import { SrpAuthEffects } from './srp-auth.effects';

describe('SrpAuthEffects', () => {
  let actions$: Observable<any>;
  let effects: SrpAuthEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        SrpAuthEffects,
        provideMockActions(() => actions$)
      ]
    });

    effects = TestBed.inject(SrpAuthEffects);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });
});
