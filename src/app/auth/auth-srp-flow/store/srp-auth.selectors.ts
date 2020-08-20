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
