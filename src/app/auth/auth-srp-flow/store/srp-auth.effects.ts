import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  switchMap,
  map,
  withLatestFrom,
  tap,
  mergeMap,
  concatMap
} from 'rxjs/operators';
import * as SrpAuthActions from './srp-auth.actions';
import { AuthenticationData } from '../model/authentication-data.model';
import { SrpAuthService } from '../services/srp-auth.service';
import { Store } from '@ngrx/store';
import * as SrpAuthSelectors from './srp-auth.selectors';
import { selectIdToken } from '../../auth-code-flow/store/auth-code.selectors';
import { SampleRequestsService } from './sample-requests.service';
import { Router } from '@angular/router';

@Injectable()
export class SrpAuthEffects {
  constructor(
    private actions$: Actions,
    private srpAuthService: SrpAuthService,
    private store: Store,
    private sampleService: SampleRequestsService,
    private router: Router
  ) {}

  // custom login
  initiateSrpLoginEffect = createEffect(() =>
    this.actions$.pipe(
      ofType(SrpAuthActions.initiateSrpAuthLogin),
      switchMap((action) => {
        const authData: AuthenticationData = {
          username: action.authData.username,
          password: action.authData.password
        };
        return this.srpAuthService.initiateLogIn(authData).pipe(
          map((loginChallenge) =>
            SrpAuthActions.respondSrpAuthLoginChallenge({
              loginChallenge,
              authData
            })
          )
        );
      })
    )
  );

  respondAuthChallengeEffect = createEffect(() =>
    this.actions$.pipe(
      ofType(SrpAuthActions.respondSrpAuthLoginChallenge),
      switchMap((action) => {
        return this.srpAuthService
          .respondToAuthChallenge(action.loginChallenge, action.authData)
          .pipe(
            map((tokens) =>
              SrpAuthActions.respondSrpAuthChallengeSuccess({ tokens })
            )
          );
      })
    )
  );

  respondAuthChallengeSuccessEffect = createEffect(() =>
    this.actions$.pipe(
      ofType(SrpAuthActions.respondSrpAuthChallengeSuccess),
      map(() => {
        return SrpAuthActions.getSrpAuthIdentityId();
      })
    )
  );

  getIdentityIdEffect = createEffect(() =>
    this.actions$.pipe(
      ofType(SrpAuthActions.getSrpAuthIdentityId),
      withLatestFrom(this.store.select(SrpAuthSelectors.selectIdToken)),
      switchMap(([, idToken]) => {
        return this.srpAuthService
          .getIdentityId(idToken)
          .pipe(
            map((identity) =>
              SrpAuthActions.getSrpAuthIdentitySuccess({ identity })
            )
          );
      })
    )
  );

  getSrpAuthIdentitySuccess = createEffect(() =>
    this.actions$.pipe(
      ofType(SrpAuthActions.getSrpAuthIdentitySuccess),
      map(() => SrpAuthActions.authGetCredentialsForIdentity())
    )
  );

  getCredentialsForIdentityEffect = createEffect(() =>
    this.actions$.pipe(
      ofType(SrpAuthActions.authGetCredentialsForIdentity),
      withLatestFrom(
        this.store.select(SrpAuthSelectors.selectIdToken),
        this.store.select(SrpAuthSelectors.selectIdentityId)
      ),
      switchMap(([, idToken, identityId]) =>
        this.srpAuthService
          .getCredentialsForIdentity(idToken, identityId)
          .pipe(
            map((credentials) =>
              SrpAuthActions.getCredentialsForIdentitySuccess({ credentials })
            )
          )
      )
    )
  );

  getCredentialsForIdentitySuccessEffect = createEffect(
    () =>
      this.actions$.pipe(
        ofType(SrpAuthActions.getCredentialsForIdentitySuccess),
        tap(() => {
          this.router.navigateByUrl('logged-in');
        })
      ),
    { dispatch: false }
  );

  testApiRequestEffect = createEffect(
    () =>
      this.actions$.pipe(
        ofType(SrpAuthActions.testAuthorizedRequest),
        mergeMap((action) =>
          this.sampleService.sampleRequest().pipe(
            map(() => {
              return { type: 'Sample Request Success' };
            })
          )
        )
      ),
    { dispatch: false }
  );
}
