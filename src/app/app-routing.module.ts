import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { SampleAuthorizedComponent } from './sample-authorized/sample-authorized.component';
import { AuthGuard } from './auth/guard/auth.guard';
import { LoginComponent } from './auth/components/login/login.component';
import { LogoutComponent } from './auth/components/logout/logout.component';

const routes: Routes = [
  {
    path: '',
    component: AppComponent
  },
  {
    path: 'sample-authorized',
    component: SampleAuthorizedComponent,
    canActivate: [AuthGuard]
  },
  { path: 'login', component: LoginComponent },
  { path: 'logout', component: LogoutComponent }
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
