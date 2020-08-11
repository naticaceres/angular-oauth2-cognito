import { createSelector } from '@ngrx/store';
import { selectAuthState } from '../../app.state';

export const selectAuth = createSelector(selectAuthState, (state) => state);

export const selectIsAuthenticated = createSelector(
  selectAuth,
  (state) => state.isAuthenticated
);

export const selectAuthVerifier = createSelector(
  selectAuth,
  (state) => state.verifier
);

export const selectIdToken = createSelector(
  selectAuth,
  (state) => state.idToken
);

export const selectAccessToken = createSelector(
  selectAuth,
  (state) => state.accessToken
);

export const selectTokenExpirationTime = createSelector(
  selectAuth,
  (state) => state.tokenExpiration
);

export const selectRefreshToken = createSelector(
  selectAuth,
  (state) => state.refreshToken
);

export const selectIsRefreshingToken = createSelector(
  selectAuth,
  (state) => state.isRefreshingTokens
);
