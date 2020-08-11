import { Injectable } from '@angular/core';
import { ofType, createEffect, Actions } from '@ngrx/effects';
import { AuthService } from '../services/auth.service';
import { Store } from '@ngrx/store';
import { CodeVerifierService } from '../services/code-verifier.service';
import * as AuthActions from './auth.actions';
import * as AuthSelectors from './auth.selectors';
import {
  tap,
  withLatestFrom,
  switchMap,
  map,
  catchError,
  filter
} from 'rxjs/operators';
import { environment } from '../../../environments';
import { of } from 'rxjs';
import { Router } from '@angular/router';
import { CustomAuthService } from '../services/custom-auth.service';
import { AuthenticationData } from '../model/authentication-data.model';
import { LocalStorageService } from '../../local-storage/local-storage.service';

@Injectable()
export class AuthEffects {
  constructor(
    private actions$: Actions,
    private authService: AuthService,
    private store: Store,
    private codeVerifierService: CodeVerifierService,
    private localStorageService: LocalStorageService,
    private router: Router,
    private customAuthService: CustomAuthService
  ) {}

  initiateLoginEffect = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.authInitiateLogin),
        tap((action) => {
          const codeChallenge = this.codeVerifierService.getCodeChallenge();
          this.localStorageService.setItem(
            'auth.verifier',
            codeChallenge.verifier
          );
          return this.authService.initiateLogin(
            environment.Auth.clientId,
            environment.Auth.response_type,
            environment.Auth.scope,
            environment.Auth.redirect_uri,
            action.requestedUrl,
            environment.Auth.identityProvider,
            codeChallenge.challenge
          );
        })
      ),
    { dispatch: false }
  );

  getTokensEffect = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.authGetTokens),
      switchMap((action) => {
        const verifier = this.localStorageService.getItem('auth.verifier');
        this.localStorageService.removeItem('auth.verifier');
        return this.authService
          .getAuthTokens(
            action.authCode,
            environment.Auth.clientId,
            environment.Auth.redirect_uri,
            verifier
          )
          .pipe(
            map((tokens) =>
              AuthActions.authGetTokensSuccess({
                tokens: tokens,
                requestedUrl: action.requestedUrl
              })
            ),
            catchError((error) =>
              of(AuthActions.authGetTokensFailure({ error }))
            )
          );
      })
    )
  );

  getTokensSuccessEffect = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.authGetTokensSuccess),
        tap((action) => {
          return this.router.navigateByUrl(action.requestedUrl);
        })
      ),
    { dispatch: false }
  );

  refreshTokensEffect = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.authRefreshTokens),
      withLatestFrom(
        this.store.select(AuthSelectors.selectRefreshToken),
        this.store.select(AuthSelectors.selectIsRefreshingToken)
      ),
      filter(([, , isrefreshing]) => !isrefreshing),
      switchMap(([, token]) =>
        this.authService.refreshTokens(environment.Auth.clientId, token).pipe(
          map((tokens) => AuthActions.authRefreshTokensSuccess({ tokens })),
          catchError((error) =>
            of(AuthActions.authRefreshTokensFailure({ error }))
          )
        )
      )
    )
  );

  refreshTokensFailureEffect = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.authRefreshTokensFailure),
      map(() => AuthActions.authLogout())
    )
  );

  logoutEffect = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.authLogout),
        tap(() =>
          this.authService.getAuthLogout(
            environment.Auth.clientId,
            environment.Auth.redirect_logout_uri
          )
        )
      ),
    { dispatch: false }
  );

  getUserInfoEffect = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.authGetUserInfo),
      switchMap(() =>
        this.authService.getUserInfo().pipe(
          map((userInfo) => AuthActions.authGetUserInfoSuccess({ userInfo })),
          catchError((error) =>
            of(AuthActions.authGetUserInfoFailure({ error }))
          )
        )
      )
    )
  );

  // custom login
  initiateCustomLoginEffect = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.customAuthInitiateLogin),
      switchMap((action) => {
        const authData: AuthenticationData = {
          username: action.email,
          password: action.password
        };
        return this.customAuthService.initiateLogIn(authData).pipe(
          map((loginChallenge) =>
            AuthActions.customRespondAuthChallenge({
              loginChallenge,
              authData
            })
          )
        );
      })
    )
  );

  respondAuthChallengeEffect = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.customRespondAuthChallenge),
        switchMap((action) => {
          return this.customAuthService.respondToAuthChallenge(
            action.loginChallenge,
            action.authData
          );
        })
      ),
    {
      dispatch: false
    }
  );
}
