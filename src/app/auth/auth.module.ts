import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './components/login/login.component';
import { LogoutComponent } from './components/logout/logout.component';
import { AuthService } from './services/auth.service';
import { CodeVerifierService } from './services/code-verifier.service';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [LoginComponent, LogoutComponent],
  providers: [AuthService, CodeVerifierService]
})
export class AuthModule {

}