import { createAction, props } from '@ngrx/store';
import { OAuthTokens } from '../model/oauth-tokens.model';
import { InitiateLoginChallenge } from '../model/initiate-login-challenge.model';
import { AuthenticationData } from '../model/authentication-data.model';

const SECTION = '[Auth]';

export const authInitiateLogin = createAction(
  SECTION + 'Initiate Login',
  props<{ requestedUrl: string }>()
);
export const authGetTokens = createAction(
  SECTION + 'Get Tokens',
  props<{ authCode: string; requestedUrl?: string }>()
);
export const authGetTokensSuccess = createAction(
  SECTION + 'Get Tokens Success',
  props<{ tokens: OAuthTokens; requestedUrl?: string }>()
);
export const authGetTokensFailure = createAction(
  SECTION + 'Get Tokens Failure',
  props<{ error: string }>()
);

export const authLogout = createAction(SECTION + 'Logout');

export const authRefreshTokens = createAction(SECTION + 'Refresh Tokens');
export const authRefreshTokensSuccess = createAction(
  SECTION + 'Refresh Tokens Success',
  props<{ tokens: OAuthTokens }>()
);
export const authRefreshTokensFailure = createAction(
  SECTION + 'Refresh Tokens Failure',
  props<{ error: string }>()
);

export const authGetUserInfo = createAction(SECTION + 'Get User Info');
export const authGetUserInfoSuccess = createAction(
  SECTION + 'Get User Info Success',
  props<{ userInfo: any }>()
);
export const authGetUserInfoFailure = createAction(
  SECTION + 'Get User Info Failure',
  props<{ error: string }>()
);

// need to separate into different module
export const customAuthInitiateLogin = createAction(
  SECTION + 'Custom Initiate Login',
  props<{ email: string; password: string }>()
);
export const customRespondAuthChallenge = createAction(
  SECTION + 'Custom Respond To Auth Challenge',
  props<{
    loginChallenge: InitiateLoginChallenge;
    authData: AuthenticationData;
  }>()
);
