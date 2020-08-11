import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/guard/auth.guard';
import { LoginComponent } from './auth/components/login/login.component';
import { LogoutComponent } from './auth/components/logout/logout.component';
import { LandingComponent } from './components/landing/landing.component';
import { SampleAuthorizedComponent } from './components/sample-authorized/sample-authorized.component';
import { CustomLoginComponent } from './auth/components/custom-login/custom-login.component';

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
  { path: 'login', component: LoginComponent },
  { path: 'logout', component: LogoutComponent },
  { path: 'login-custom', component: CustomLoginComponent }
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
