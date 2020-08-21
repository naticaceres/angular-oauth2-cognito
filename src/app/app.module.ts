import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HelloComponent } from './components/hello/hello.component';
import { MatButtonModule } from '@angular/material/button';
import { StoreModule } from '@ngrx/store';
import { AppRoutingModule } from './app-routing.module';
import { AuthModule } from './auth/auth.module';
import { LandingComponent } from './components/landing/landing.component';
import { AppComponent } from './components/app/app.component';
import { SampleAuthorizedComponent as AuthorizedComponent } from './components/sample-authorized/sample-authorized.component';
import { EffectsModule } from '@ngrx/effects';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from '../environments';
import { AuthV4SignInterceptor } from './auth/auth-srp-flow/interceptors/auth-v4-sign.interceptor';
import { WINDOW_PROVIDERS } from './providers/window.provider';
import { HostService } from './services/host.service';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    MatButtonModule,
    HttpClientModule,

    // app
    AppRoutingModule,
    AuthModule,

    //ngrx
    StoreModule.forRoot({}),
    EffectsModule.forRoot([]),
    StoreDevtoolsModule.instrument({
      maxAge: 25,
      logOnly: environment.production
    })
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthV4SignInterceptor,
      multi: true
    },
    WINDOW_PROVIDERS,
    HostService
  ],
  declarations: [
    AppComponent,
    HelloComponent,
    AuthorizedComponent,
    LandingComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
