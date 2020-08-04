import { createSelector } from '@ngrx/store';
import { selectAuthState } from 'src/app/app.state';

export const selectAuth = createSelector(selectAuthState, (state) => state);

export const selectIsAuthenticated = createSelector(
  selectAuthState,
  (state) => state.isAuthenticated
);

export const selectAuthVerifier = createSelector(
  selectAuthState,
  (state) => state.verifier
);

export const selectIdToken = createSelector(
  selectAuthState,
  (state) => state.idToken
);

export const selectAccessToken = createSelector(
  selectAuthState,
  (state) => state.accessToken
);

export const selectTokenExpirationTime = createSelector(
  selectAuthState,
  (state) => state.tokenExpiration
);

export const selectRefreshToken = createSelector(
  selectAuthState,
  (state) => state.refreshToken
);

export const selectIsRefreshingToken = createSelector(
  selectAuthState,
  (state) => state.isRefreshingTokens
);
