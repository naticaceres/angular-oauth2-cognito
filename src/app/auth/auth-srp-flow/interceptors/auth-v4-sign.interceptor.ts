import { Injectable, Inject } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpHeaders
} from '@angular/common/http';
import { Observable, noop } from 'rxjs';
import { SrpHelperService } from '../services/srp-helper.service';
import { environment } from 'src/environments';
import { DatePipe } from '@angular/common';
import { Store } from '@ngrx/store';
import {
  selectSecretAccessKey,
  selectSessionToken,
  selectAccessKeyId
} from '../store/srp-auth.selectors';
import { tap, withLatestFrom, first, map, mergeMap } from 'rxjs/operators';

const V4_SIGNATURE_EXCEPTED_URLS = [
  `cognito-idp.${environment.Auth.srpFlow.region}.amazonaws.com`,
  `cognito-identity.${environment.Auth.srpFlow.region}.amazonaws.com`
];
const EXCLUDED_HEADERS = ['cache-control', 'authority', 'scheme', 'pragma'];
const NEWLINE = '\n';
const amzDateHeader = 'x-amz-date';
const amzSecurityTokenHeader = 'x-amz-security-token';
const authorizationHeader = 'authorization';
const awsService = 'execute-api';
const v4Request = 'aws4_request';
const AUTH_HEADER_ALGORITHM = 'AWS4-HMAC-SHA256';

@Injectable()
export class AuthV4SignInterceptor implements HttpInterceptor {
  constructor(
    @Inject('HOSTNAME') private host: string,
    private srpHelperService: SrpHelperService,
    private datePipe: DatePipe,
    private store: Store
  ) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    if (
      V4_SIGNATURE_EXCEPTED_URLS.find((except) => request.url.includes(except))
    ) {
      return next.handle(request);
    }

    const nowDate = new Date(Date.now());
    const iso8601Date = this.datePipe.transform(
      nowDate,
      "yyyyMMdd'T'HHmmss'Z'",
      '+0000'
    );
    const shortDateString = this.datePipe.transform(
      nowDate,
      'yyyyMMdd',
      '+0000'
    );

    return this.store.select(selectSessionToken).pipe(
      withLatestFrom(
        this.store.select(selectSecretAccessKey),
        this.store.select(selectAccessKeyId)
      ),
      first(),
      mergeMap(([sessionToken, secretKey, accessKey]) => {
        const canonicalHeadersArray = this.getCanonicalHeadersArray(
          request.headers,
          iso8601Date,
          sessionToken
        );
        const signedHeaders = this.getSignedHeaders(canonicalHeadersArray);

        const canonicalRequest = this.getCanonicalRequest(
          request.method,
          request.url,
          request.body,
          canonicalHeadersArray,
          signedHeaders
        );

        const stringToSign = this.getStringToSign(
          iso8601Date,
          shortDateString,
          canonicalRequest
        );

        const signature = this.getSignature(
          secretKey,
          shortDateString,
          stringToSign
        );

        const authorizationHeaderValue = this.getAuthHeaderValue(
          accessKey,
          shortDateString,
          signedHeaders,
          signature
        );

        const authorizedRequest = request.clone({
          headers: request.headers
            .set(amzDateHeader, iso8601Date)
            .set(amzSecurityTokenHeader, sessionToken)
            .set(authorizationHeader, authorizationHeaderValue)
        });
        return next.handle(authorizedRequest);
      })
    );
  }

  private getCanonicalRequest(
    httpVerb: string,
    url: string,
    body: any,
    canonicalHeaders: string[],
    signedHeaders: string
  ): string {
    const urlWithoutDomain = url.replace(environment.apiDomain, '');
    const urlParts = urlWithoutDomain.split('?');
    const canonicalUrl = urlParts[0];

    const canonicalQueryString =
      urlParts.length > 1
        ? urlParts[1]
            .split('&')
            .map((part) => this.parseUrlParam(part))
            .join('&')
        : '';

    const hashedPayload = this.srpHelperService.hashPayload(body);

    const stringCanonicalHeaders = canonicalHeaders.sort().join(NEWLINE);

    const canonicalRequest =
      httpVerb +
      NEWLINE +
      encodeURI(canonicalUrl) +
      NEWLINE +
      canonicalQueryString +
      NEWLINE +
      stringCanonicalHeaders +
      NEWLINE +
      signedHeaders +
      NEWLINE +
      hashedPayload;

    return canonicalRequest;
  }

  private parseUrlParam(rawParam: string) {
    const paramParts = rawParam.split('=');
    const paramName = encodeURI(paramParts[0]);
    const paramValue = paramParts.length > 1 ? encodeURI(paramParts[1]) : '';
    const encodedParam = `${paramName}=${paramValue}`;
    return encodedParam;
  }

  private getCanonicalHeadersArray(
    headers: HttpHeaders,
    iso8601Date: string,
    sessionToken: string
  ): string[] {
    let canonicalHeaders = [];
    const headerKeys = headers
      .keys()
      .sort()
      .filter((h) => EXCLUDED_HEADERS.indexOf(h) < 0);
    for (let i = 0; i < headerKeys.length; i++) {
      canonicalHeaders.push(
        headerKeys[i].toLowerCase() + ':' + headers.get(headerKeys[i]).trim()
      );
    }
    const hostString = environment.apiDomain.replace('https://', '');
    canonicalHeaders.push('host:' + hostString);
    canonicalHeaders.push(amzDateHeader + ':' + iso8601Date);
    canonicalHeaders.push(amzSecurityTokenHeader + ':' + sessionToken);
    return canonicalHeaders;
  }

  private getSignedHeaders(canonicalHeaders: string[]): string {
    const signedHeaders = canonicalHeaders
      .map((h) => h.split(':')[0])
      .sort()
      .join(';');
    return signedHeaders;
  }

  private getStringToSign(
    iso8601Date: string,
    shortDateString: string,
    canonicalRequest: string
  ): string {
    const stringToSign =
      AUTH_HEADER_ALGORITHM +
      NEWLINE +
      iso8601Date +
      NEWLINE +
      shortDateString +
      '/' +
      environment.Auth.srpFlow.region +
      `/${awsService}/${v4Request}` +
      NEWLINE;
    this.srpHelperService.hashPayload(canonicalRequest);
    return stringToSign;
  }

  private getSignature(
    secretKey: string,
    shortDateString: string,
    stringToSign: string
  ): string {
    const dateKey = this.srpHelperService.keyedHash256(
      'AWS4' + secretKey,
      shortDateString
    );
    const dateRegionKey = this.srpHelperService.keyedHash256(
      dateKey,
      environment.Auth.srpFlow.region
    );
    const dateRegionServiceKey = this.srpHelperService.keyedHash256(
      dateRegionKey,
      awsService
    );
    const signingKey = this.srpHelperService.keyedHash256(
      dateRegionServiceKey,
      v4Request
    );

    const signature = this.srpHelperService.hexKeyedHash256(
      signingKey,
      stringToSign
    );

    return signature;
  }

  private getAuthHeaderValue(
    accessKey: string,
    shortDateString: string,
    signedHeaders: string,
    signature: string
  ) {
    const credential = `${accessKey}/${shortDateString}/${environment.Auth.srpFlow.region}/${awsService}/${v4Request}`;
    const authValue = `${AUTH_HEADER_ALGORITHM} Credential=${credential}, SignedHeaders=${signedHeaders}, Signature=${signature}`;
    return authValue;
  }
}

//AWS4-HMAC-SHA256 Credential=ASIASEZIHNJN75UX5FWR/20200821/us-east-2/execute-api/aws4_request, SignedHeaders=host;x-amz-date;x-amz-security-token, Signature=931b9504491c2b8a54efda434101c7a0010d2b993a8e1f7acc8219e949a2b8e4
