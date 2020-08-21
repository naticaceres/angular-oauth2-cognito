import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { DOCUMENT } from '@angular/common';
import { Observable } from 'rxjs';
import { OAuthTokens } from '../model/oauth-tokens.model';
import { environment } from '../../../../environments';

@Injectable()
export class AuthCodeService {
  hostedUiUri = environment.Auth.hostedUiUrl;
  constructor(
    private http: HttpClient,
    @Inject(DOCUMENT) private document: Document
  ) {}

  initiateLogin(
    clientId: string,
    responseType: string,
    scopes: string,
    redirectUri: string,
    state: string,
    identityProvider: string,
    codeChallenge: string
  ) {
    const params = new HttpParams()
      .set('client_id', clientId)
      .set('response_type', responseType)
      .set('scopes', scopes)
      .set('redirect_uri', redirectUri)
      .set('state', state)
      .set('identity_provider', identityProvider)
      .set('code_challenge_method', 'S256')
      .set('code_challenge', codeChallenge);

    this.document.location.href =
      `${this.hostedUiUri}oauth2/authorize?` + params.toString();
  }

  getAuthTokens(
    authCode: string,
    clientId: string,
    redirectUri: string,
    codeVerifier: string
  ): Observable<OAuthTokens> {
    const body = new HttpParams()
      .set('grant_type', 'authorization_code')
      .set('code', authCode)
      .set('client_id', clientId)
      .set('redirect_uri', redirectUri)
      .set('code_verifier', codeVerifier);
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });
    return this.http.post<OAuthTokens>(
      this.hostedUiUri + 'oauth2/token',
      body.toString(),
      {
        headers
      }
    );
  }

  getAuthLogout(clientId: string, redirectUri: string) {
    const params = new HttpParams()
      .set('client_id', clientId)
      .set('logout_uri', redirectUri);
    const logoutUrl = `${
      environment.Auth.hostedUiUrl
    }/logout?${params.toString()}`;
    this.document.location.href = logoutUrl;
  }

  refreshTokens(clientId: string, refreshToken: string) {
    const body = new HttpParams()
      .set('grant_type', 'refresh_token')
      .set('client_id', clientId)
      .set('refresh_token', refreshToken);
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });
    return this.http.post<OAuthTokens>(
      this.hostedUiUri + 'oauth2/token',
      body.toString(),
      {
        headers
      }
    );
  }

  getUserInfo() {
    const url = this.hostedUiUri + 'oauth2/userInfo';
    return this.http.get(url);
  }
}
