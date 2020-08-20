import {
  ActionReducerMap,
  createFeatureSelector,
  createSelector
} from '@ngrx/store';
import {
  authCodeReducer,
  AuthCodeState
} from '../auth-code-flow/store/auth-code.reducer';
import {
  srpAuthReducer,
  SrpAuthState
} from '../auth-srp-flow/store/srp-auth.reducer';
import * as fromRoot from '../../app.state';

export const FEATURE_NAME = 'auth';

export const authReducers: ActionReducerMap<AuthState> = {
  authCode: authCodeReducer,
  authSrp: srpAuthReducer
};

export interface AuthState {
  authCode: AuthCodeState;
  authSrp: SrpAuthState;
}

export interface State extends fromRoot.AppState {
  auth: AuthState;
}

export const selectAuthState = createFeatureSelector<State, AuthState>(
  FEATURE_NAME
);
