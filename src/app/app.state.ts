import * as Auth from './auth/store/auth.reducer';
import { createFeatureSelector, ActionReducerMap } from '@ngrx/store';

export interface AppState {
  auth: Auth.AuthState;
}

export const reducers: ActionReducerMap<AppState> = {
  auth: Auth.authReducer
};

export const selectAuthState = createFeatureSelector<AppState, Auth.AuthState>(
  'auth'
);
