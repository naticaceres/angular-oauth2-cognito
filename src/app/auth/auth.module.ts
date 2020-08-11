import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { LoginComponent } from './components/login/login.component';
import { LogoutComponent } from './components/logout/logout.component';
import { AuthService } from './services/auth.service';
import { CodeVerifierService } from './services/code-verifier.service';
import { CustomLoginComponent } from './components/custom-login/custom-login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  declarations: [LoginComponent, LogoutComponent, CustomLoginComponent],
  providers: [AuthService, CodeVerifierService, DatePipe]
})
export class AuthModule {}
