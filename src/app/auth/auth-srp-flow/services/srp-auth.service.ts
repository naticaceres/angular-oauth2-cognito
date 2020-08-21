import { Injectable } from '@angular/core';
import { SrpHelperService } from './srp-helper.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SrpAuthTokens } from '../model/srp-auth-tokens.model';
import { InitiateLoginChallenge } from '../model/initiate-login-challenge.model';
import { DatePipe } from '@angular/common';
import { AuthenticationData } from '../model/authentication-data.model';
import { environment } from '../../../../environments';
import { AuthIdentity } from '../model/auth-identity.model';
import { AuthIdentityCredentials } from '../model/auth-identity-credentials.model';

@Injectable({
  providedIn: 'root'
})
export class SrpAuthService {
  cognitoUrl = environment.Auth.srpFlow.cognitoIdpUrl.replace(
    '{region}',
    environment.Auth.srpFlow.region
  );
  userPoolId = environment.Auth.srpFlow.userPoolId.split('_')[1];
  constructor(
    private srpService: SrpHelperService,
    private http: HttpClient,
    private datePipe: DatePipe
  ) {}

  initiateLogIn(
    authData: AuthenticationData
  ): Observable<InitiateLoginChallenge> {
    const body = {
      AuthFlow: 'USER_SRP_AUTH',
      ClientId: environment.Auth.clientId,
      ClientMetadata: {},
      AuthParameters: {
        USERNAME: authData.username,
        SRP_A: this.srpService.largeAValue.toString(16)
      }
    };

    const headers = new HttpHeaders({
      'Cache-Control': 'no-cache',
      'Content-Type': 'application/x-amz-json-1.1',
      Authority: `cognito-idp.${environment.Auth.srpFlow.region}.amazonaws.com`,
      Scheme: 'https',
      Pragma: 'no-cache',
      'x-amz-target': 'AWSCognitoIdentityProviderService.InitiateAuth',
      'x-amz-user-agent': 'aws-amplify/0.1.x js'
    });

    return this.http.post<InitiateLoginChallenge>(this.cognitoUrl, body, {
      headers
    });
  }

  respondToAuthChallenge(
    loginChallenge: InitiateLoginChallenge,
    authData: AuthenticationData //{username, password}
  ): Observable<SrpAuthTokens> {
    const nowTimeStamp = this.datePipe.transform(
      new Date(),
      'EEE LLL dd HH:mm:ss UTC yyyy',
      '+0000'
    );
    //"ddd MMM D HH:mm:ss UTC YYYY"
    //"Mon Aug 10 14:44:10 UTC 2020"

    const signature2 = this.srpService.getSignature(
      loginChallenge.ChallengeParameters,
      authData,
      nowTimeStamp
    );

    const body = {
      ChallengeName: 'PASSWORD_VERIFIER',
      ClientId: environment.Auth.clientId,
      ChallengeResponses: {
        USERNAME: loginChallenge.ChallengeParameters.USER_ID_FOR_SRP,
        PASSWORD_CLAIM_SECRET_BLOCK:
          loginChallenge.ChallengeParameters.SECRET_BLOCK,
        TIMESTAMP: nowTimeStamp,
        PASSWORD_CLAIM_SIGNATURE: signature2
      }
    };

    const headers = new HttpHeaders({
      'Cache-Control': 'no-cache',
      'Content-Type': 'application/x-amz-json-1.1',
      Authority: `cognito-idp.${environment.Auth.srpFlow.region}.amazonaws.com`,
      Scheme: 'https',
      Pragma: 'no-cache',
      'x-amz-target':
        'AWSCognitoIdentityProviderService.RespondToAuthChallenge',
      'x-amz-user-agent': 'aws-amplify/0.1.x js'
    });
    return this.http.post<SrpAuthTokens>(this.cognitoUrl, body, { headers });
  }

  getIdentityId(idToken: string): Observable<AuthIdentity> {
    const key = `cognito-idp.${environment.Auth.srpFlow.region}.amazonaws.com/${environment.Auth.srpFlow.userPoolId}`;
    const logins = {
      [key]: idToken
    };
    const body = {
      IdentityPoolId: environment.Auth.srpFlow.identityPoolId,
      Logins: logins
    };

    const hashedPayload = this.srpService.hashPayload(body);
    const headers = new HttpHeaders({
      'x-amz-content-sha256': hashedPayload,
      'x-amz-target': 'AWSCognitoIdentityService.GetId',
      'content-type': 'application/x-amz-json-1.1'
    });

    const url = environment.Auth.srpFlow.cognitoIdentityUrl.replace(
      '{region}',
      environment.Auth.srpFlow.region
    );

    return this.http.post<AuthIdentity>(url, body, { headers });
  }

  getCredentialsForIdentity(
    idToken: string,
    identityId: string
  ): Observable<AuthIdentityCredentials> {
    const key = `cognito-idp.${environment.Auth.srpFlow.region}.amazonaws.com/${environment.Auth.srpFlow.userPoolId}`;
    const logins = {
      [key]: idToken
    };
    const body = {
      IdentityId: identityId,
      Logins: logins
    };

    const hashedPayload = this.srpService.hashPayload(body);
    const headers = new HttpHeaders({
      'x-amz-content-sha256': hashedPayload,
      'x-amz-target': 'AWSCognitoIdentityService.GetCredentialsForIdentity',
      'content-type': 'application/x-amz-json-1.1'
    });

    const url = environment.Auth.srpFlow.cognitoIdentityUrl.replace(
      '{region}',
      environment.Auth.srpFlow.region
    );

    return this.http.post<AuthIdentityCredentials>(url, body, { headers });
  }
}
