import { createFeatureSelector, createSelector } from '@ngrx/store';
import { selectAuthState } from '../../store/auth.reducer';

export const selectSrpAuthState = createSelector(
  selectAuthState,
  (auth) => auth.authSrp
);

export const selectIdToken = createSelector(
  selectSrpAuthState,
  (state) => state.idToken
);

export const selectIdentityId = createSelector(
  selectSrpAuthState,
  (state) => state.identityId
);

export const selectUserName = createSelector(
  selectSrpAuthState,
  (state) => state.userName
);

export const selectSecretAccessKey = createSelector(
  selectSrpAuthState,
  (state) => state.secretKey
);

export const selectAccessKeyId = createSelector(
  selectSrpAuthState,
  (state) => state.accessKeyId
);

export const selectSessionToken = createSelector(
  selectSrpAuthState,
  (state) => state.sessionToken
);
