import * as fromSrpAuth from './srp-auth.actions';

describe('loadSrpAuths', () => {
  it('should return an action', () => {
    expect(fromSrpAuth.loadSrpAuths().type).toBe('[SrpAuth] Load SrpAuths');
  });
});
