import { Action, createReducer, on } from '@ngrx/store';
import * as SrpAuthActions from './srp-auth.actions';

export const srpAuthFeatureKey = 'srpAuth';

export interface SrpAuthState {
  isAuthenticated: boolean;
  userName: string;
  accessToken: string;
  idToken: string;
  refreshToken: string;
  tokenType: string;
  tokenExpiresIn: number;
  tokenExpirationTime: string;

  identityId: string;
  identityPoolId: string;
  iDPlogins: string;
  accessKeyId: string;
  accessExpiration: number;
  accessExpirationDate: string;
  secretKey: string;
  sessionToken: string;
}

export const initialState: SrpAuthState = {
  isAuthenticated: false,
  userName: '',
  accessToken: '',
  idToken: '',
  refreshToken: '',
  tokenType: '',
  tokenExpiresIn: null,
  tokenExpirationTime: '',

  identityId: '',
  identityPoolId: '',
  iDPlogins: '',
  accessKeyId: '',
  accessExpiration: null,
  accessExpirationDate: '',
  secretKey: '',
  sessionToken: ''
};

export const srpAuthReducer = createReducer(
  initialState,
  on(SrpAuthActions.initiateSrpAuthLogin, (state, action) => {
    return {
      ...state,
      userName: action.authData.username
    };
  }),
  on(SrpAuthActions.respondSrpAuthChallengeSuccess, (state, action) => ({
    ...state,
    accessToken: action.tokens.AuthenticationResult.AccessToken,
    tokenExpiresIn: action.tokens.AuthenticationResult.ExpiresIn,
    idToken: action.tokens.AuthenticationResult.IdToken,
    refreshToken: action.tokens.AuthenticationResult.RefreshToken,
    tokenType: action.tokens.AuthenticationResult.TokenType,
    tokenExpirationTime: AuthReducerUtil.getExpirationDate(
      action.tokens.AuthenticationResult.ExpiresIn
    ),
    isAuthenticated: true
  })),
  on(SrpAuthActions.getSrpAuthIdentitySuccess, (state, action) => ({
    ...state,
    identityId: action.identity.IdentityId
  })),
  on(SrpAuthActions.getCredentialsForIdentitySuccess, (state, action) => ({
    ...state,
    accessKeyId: action.credentials.Credentials.AccessKeyId,
    accessExpiration: action.credentials.Credentials.Expiration,
    accessExpirationDate: AuthReducerUtil.getExpirationDate(
      action.credentials.Credentials.Expiration
    ),
    secretKey: action.credentials.Credentials.SecretKey,
    sessionToken: action.credentials.Credentials.SessionToken
  }))
);

class AuthReducerUtil {
  static getExpirationDate(secondsUntilExpiration: number): string {
    let expirationDate = new Date();
    expirationDate.setSeconds(
      expirationDate.getSeconds() + secondsUntilExpiration
    );
    return expirationDate.toISOString();
  }
}
