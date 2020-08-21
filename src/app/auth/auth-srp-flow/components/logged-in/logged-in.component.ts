import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import * as SrpAuthSelectors from '../../store/srp-auth.selectors';
import * as SrpAuthActions from '../../store/srp-auth.actions';

@Component({
  selector: 'app-logged-in',
  templateUrl: './logged-in.component.html',
  styleUrls: ['./logged-in.component.css']
})
export class LoggedInComponent implements OnInit {
  userName$: Observable<string>;
  sessionToken$: Observable<string>;
  secretKey$: Observable<string>;
  accessKey$: Observable<string>;

  constructor(private store: Store) {}

  ngOnInit() {
    this.userName$ = this.store.select(SrpAuthSelectors.selectIdentityId);
    this.sessionToken$ = this.store.select(SrpAuthSelectors.selectSessionToken);
    this.secretKey$ = this.store.select(SrpAuthSelectors.selectSecretAccessKey);
    this.accessKey$ = this.store.select(SrpAuthSelectors.selectAccessKeyId);
  }

  testRequest() {
    this.store.dispatch(SrpAuthActions.testAuthorizedRequest());
  }
}
