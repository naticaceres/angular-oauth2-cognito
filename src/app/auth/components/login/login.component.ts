import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { authGetTokens, authInitiateLogin } from '../../store/auth.actions';
import { take, map } from 'rxjs/operators';
import { selectIsAuthenticated } from '../../store/auth.selectors';
import { noop } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
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
