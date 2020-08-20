import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router
} from '@angular/router';
import { Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { map } from 'rxjs/operators';
import { selectIsAuthenticated } from '../auth-code-flow/store/auth-code.selectors';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private store: Store, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return this.store.pipe(select(selectIsAuthenticated)).pipe(
      map((isAuthenticated) => {
        return isAuthenticated
          ? isAuthenticated
          : this.router.createUrlTree(['/login'], {
              queryParams: { state: state.url }
            });
      })
    );
  }
}
