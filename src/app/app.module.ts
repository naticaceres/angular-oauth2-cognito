import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HelloComponent } from './components/hello/hello.component';
import { MatButtonModule } from '@angular/material/button';
import { StoreModule } from '@ngrx/store';
import { reducers } from './app.state';
import { AppRoutingModule } from './app-routing.module';
import { AuthModule } from './auth/auth.module';
import { LandingComponent } from './components/landing/landing.component';
import { AppComponent } from './components/app/app.component';
import { SampleAuthorizedComponent as AuthorizedComponent } from './components/sample-authorized/sample-authorized.component';
import { EffectsModule } from '@ngrx/effects';
import { AuthEffects } from './auth/store/auth.effects';
import { HttpClientModule } from '@angular/common/http';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from '../environments';

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
    EffectsModule.forRoot([AuthEffects]),
    StoreModule.forRoot(reducers),
    StoreDevtoolsModule.instrument({
      maxAge: 25,
      logOnly: environment.production
    })
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
