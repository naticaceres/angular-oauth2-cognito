import { createSelector } from '@ngrx/store';
import { selectAuthState } from '../../store/auth.reducer';

export const selectAuthCodeState = createSelector(
  selectAuthState,
  (auth) => auth.authCode
);

export const selectIsAuthenticated = createSelector(
  selectAuthCodeState,
  (state) => state.isAuthenticated
);

export const selectAuthCodeStateVerifier = createSelector(
  selectAuthCodeState,
  (state) => state.verifier
);

export const selectIdToken = createSelector(
  selectAuthCodeState,
  (state) => state.idToken
);

export const selectAccessToken = createSelector(
  selectAuthCodeState,
  (state) => state.accessToken
);

export const selectTokenExpirationTime = createSelector(
  selectAuthCodeState,
  (state) => state.tokenExpiration
);

export const selectRefreshToken = createSelector(
  selectAuthCodeState,
  (state) => state.refreshToken
);

export const selectIsRefreshingToken = createSelector(
  selectAuthCodeState,
  (state) => state.isRefreshingTokens
);
