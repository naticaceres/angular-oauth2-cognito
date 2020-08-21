import { createAction, props } from '@ngrx/store';
import { InitiateLoginChallenge } from '../model/initiate-login-challenge.model';
import { AuthenticationData } from '../model/authentication-data.model';
import { SrpAuthTokens } from '../model/srp-auth-tokens.model';
import { AuthIdentity } from '../model/auth-identity.model';
import { AuthIdentityCredentials } from '../model/auth-identity-credentials.model';

const SECTION = '[Srp Auth] ';

export const initiateSrpAuthLogin = createAction(
  SECTION + 'Initiate Login',
  props<{ authData: AuthenticationData }>()
);

export const respondSrpAuthLoginChallenge = createAction(
  SECTION + 'Respond to srp Auth challenge',
  props<{
    loginChallenge: InitiateLoginChallenge;
    authData: AuthenticationData;
  }>()
);

export const respondSrpAuthChallengeSuccess = createAction(
  SECTION + 'Respond to Srp Auth Challenge Success',
  props<{ tokens: SrpAuthTokens }>()
);

export const getSrpAuthIdentityId = createAction(SECTION + 'Get Identity Id');

export const getSrpAuthIdentitySuccess = createAction(
  SECTION + 'Get Identity Id Success',
  props<{ identity: AuthIdentity }>()
);

export const authGetCredentialsForIdentity = createAction(
  SECTION + 'Get Credentials For Identity'
);

export const getCredentialsForIdentitySuccess = createAction(
  SECTION + ' Get Credentials For Identity Success',
  props<{ credentials: AuthIdentityCredentials }>()
);

export const testAuthorizedRequest = createAction(
  SECTION + ' Test Authorized Resuqest'
);
