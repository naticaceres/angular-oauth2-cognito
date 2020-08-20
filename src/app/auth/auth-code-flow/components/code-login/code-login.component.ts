import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import {
  authGetTokens,
  authInitiateLogin
} from '../../store/auth-code.actions';
import { take, map } from 'rxjs/operators';
import { selectIsAuthenticated } from '../../store/auth-code.selectors';
import { noop } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './code-login.component.html',
  styleUrls: ['./code-login.component.css']
})
export class CodeLoginComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private store: Store,
    private router: Router
  ) {}

  ngOnInit() {
    const authCode = this.route.snapshot.queryParams.code;
    const requestedUrl = this.route.snapshot.queryParams.state;

    if (!!authCode) {
      this.store.dispatch(authGetTokens({ authCode, requestedUrl }));
      return;
    }

    this.store
      .pipe(
        take(1),
        select(selectIsAuthenticated),
        map((isAuthenticated) => {
          if (isAuthenticated) {
            return this.router.navigate(requestedUrl);
          }
          this.store.dispatch(authInitiateLogin({ requestedUrl }));
        })
      )
      .subscribe(noop);
  }
}
