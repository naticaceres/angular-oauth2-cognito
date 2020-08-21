import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/guard/auth.guard';
import { LandingComponent } from './components/landing/landing.component';
import { SampleAuthorizedComponent } from './components/sample-authorized/sample-authorized.component';
import { LogoutComponent } from './auth/auth-code-flow/components/logout/logout.component';
import { SrpLoginComponent } from './auth/auth-srp-flow/components/srp-login/srp-login.component';
import { CodeLoginComponent } from './auth/auth-code-flow/components/code-login/code-login.component';
import { LoggedInComponent } from './auth/auth-srp-flow/components/logged-in/logged-in.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'landing',
    pathMatch: 'full'
  },
  {
    path: 'landing',
    component: LandingComponent
  },
  {
    path: 'sample-authorized',
    component: SampleAuthorizedComponent,
    canActivate: [AuthGuard]
  },
  { path: 'login', component: CodeLoginComponent },
  { path: 'logout', component: LogoutComponent },
  { path: 'login-custom', component: SrpLoginComponent },
  { path: 'logged-in', component: LoggedInComponent }
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
