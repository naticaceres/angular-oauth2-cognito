import { createReducer, on, Action, ActionReducerMap } from '@ngrx/store';
import * as AuthActions from './auth-code.actions';

export interface AuthCodeState {
  verifier: string;
  lastVisitedUrl: string;
  isAuthenticated: boolean;
  user: any;
  accessToken: string;
  idToken: string;
  refreshToken: string;
  tokenExpiration: string;
  isRefreshingTokens: boolean;
  error: string;
}

export const initialState: AuthCodeState = {
  verifier: '',
  lastVisitedUrl: '',
  isAuthenticated: false,
  user: null,
  accessToken: '',
  idToken: '',
  refreshToken: '',
  tokenExpiration: '',
  isRefreshingTokens: false,
  error: ''
};

export const authCodeReducer = createReducer(
  initialState,
  on(AuthActions.authGetTokensSuccess, (state, action) => ({
    ...state,
    isAuthenticated: true,
    accessToken: action.tokens.access_token,
    idToken: action.tokens.id_token,
    refreshToken: action.tokens.refresh_token,
    tokenExpiration: AuthCodeReducerUtil.getExpirationDate(
      action.tokens.expires_in
    ),
    isRefreshingTokens: false
  })),
  on(AuthActions.authGetTokensFailure, (state, action) => ({
    ...state,
    error: 'Auth Get Tokens Error: ' + action.error
  })),
  on(AuthActions.authRefreshTokens, (state, action) => ({
    ...state,
    accessToken: '',
    idToken: '',
    isRefreshingTokens: true
  })),
  on(AuthActions.authRefreshTokensSuccess, (state, action) => ({
    ...state,
    accessToken: action.tokens.access_token,
    idToken: action.tokens.id_token,
    tokenExpiration: AuthCodeReducerUtil.getExpirationDate(
      action.tokens.expires_in
    ),
    isRefreshingTokens: false
  })),
  on(AuthActions.authRefreshTokensFailure, (state, action) => ({
    ...state,
    error: 'Auth Refresh Tokens Error: ' + action.error
  })),
  on(AuthActions.authLogout, () => initialState)
);

class AuthCodeReducerUtil {
  static getExpirationDate(secondsUntilExpiration: number): string {
    let expirationDate = new Date();
    expirationDate.setSeconds(
      expirationDate.getSeconds() + secondsUntilExpiration
    );
    return expirationDate.toISOString();
  }
}
