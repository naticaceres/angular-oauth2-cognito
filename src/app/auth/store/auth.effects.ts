import { Injectable } from '@angular/core';
import { ofType, createEffect, Actions } from '@ngrx/effects';
import { AuthService } from '../services/auth.service';
import { Store } from '@ngrx/store';
import { CodeVerifierService } from '../services/code-verifier.service';
import * as AuthActions from './auth.actions';
import * as AuthSelectors from './auth.selectors';
import { tap } from 'rxjs/operators';
import { LocalStorageService } from 'src/app/local-storage/local-storage.service';
import { environment } from 'src/environments';

@Injectable()
export class AuthEffects {
  constructor(
    private actions$: Actions,
    private authService: AuthService,
    private store: Store,
    private codeVerifierService: CodeVerifierService,
    private localStorageService: LocalStorageService
  ) {}

  initiateLoginEffect = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.authInitiateLogin),
        tap((action) => {
          const codeChallenge = this.codeVerifierService.getCodeChallenge();
          this.localStorageService.setItem('verifier', codeChallenge.verifier);
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
}
