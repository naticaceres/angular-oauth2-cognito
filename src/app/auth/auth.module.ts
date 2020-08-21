import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EffectsModule } from '@ngrx/effects';
import { SrpAuthEffects } from './auth-srp-flow/store/srp-auth.effects';
import { AuthCodeEffects } from './auth-code-flow/store/auth-code.effects';
import { LogoutComponent } from './auth-code-flow/components/logout/logout.component';
import { SrpLoginComponent } from './auth-srp-flow/components/srp-login/srp-login.component';
import { AuthCodeService } from './auth-code-flow/services/auth-code.service';
import { CodeVerifierService } from './auth-code-flow/services/code-verifier.service';
import { SrpAuthService } from './auth-srp-flow/services/srp-auth.service';
import { CodeLoginComponent } from './auth-code-flow/components/code-login/code-login.component';
import { StoreModule } from '@ngrx/store';
import { authReducers, FEATURE_NAME } from './store/auth.reducer';
import { LoggedInComponent } from './auth-srp-flow/components/logged-in/logged-in.component';
import { MatButtonModule } from '@angular/material/button';
import { hostFactory } from './auth-srp-flow/services/host-factory.service';

@NgModule({
  imports: [
    MatButtonModule,

    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    StoreModule.forFeature(FEATURE_NAME, authReducers),
    EffectsModule.forFeature([SrpAuthEffects, AuthCodeEffects])
  ],
  declarations: [
    CodeLoginComponent,
    LogoutComponent,
    SrpLoginComponent,
    LoggedInComponent
  ],
  providers: [
    AuthCodeService,
    CodeVerifierService,
    DatePipe,
    SrpAuthService,
    { provide: 'HOSTNAME', useFactory: hostFactory }
  ]
})
export class AuthModule {}
