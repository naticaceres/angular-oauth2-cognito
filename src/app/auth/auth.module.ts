import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './components/login/login.component';
import { LogoutComponent } from './components/logout/logout.component';
import { AuthService } from './services/auth.service';
import { CodeVerifierService } from './services/code-verifier.service';
import { StoreModule } from '@ngrx/store';
import * as AuthState from './store/auth.reducer';

@NgModule({
  imports: [CommonModule],
  declarations: [LoginComponent, LogoutComponent],
  providers: [AuthService, CodeVerifierService]
})
export class AuthModule {}
