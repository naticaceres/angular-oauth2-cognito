import { createReducer, on, Action } from '@ngrx/store';
import * as AuthActions from './auth.actions';

export interface AuthState {
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

export const initialState: AuthState = {
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

const reducer = createReducer(
  initialState,
  on(AuthActions.authGetTokensSuccess, (state, action) => {
    let expirationDate = new Date();
    expirationDate.setSeconds(expirationDate.getSeconds() + action.tokens.expires_in);
    return {
      ...state,
      isAuthenticated: true,
      accessToken: action.tokens.access_token,
      idToken: action.tokens.id_token,
      refreshToken: action.tokens.refresh_token,
      tokenExpiration: expirationDate.toISOString,
      isRefreshingTokens: false
    }
  })
)