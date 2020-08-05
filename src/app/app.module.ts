import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { HelloComponent } from './hello.component';
import { MatButtonModule } from '@angular/material/button';
import { StoreModule } from '@ngrx/store';
import { reducers } from './app.state';
import { AppRoutingModule } from './app-routing.module';
import { SampleAuthorizedComponent } from './sample-authorized/sample-authorized.component';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    MatButtonModule,

    // app
    AppRoutingModule,

    //ngrx
    StoreModule.forRoot(reducers)
  ],
  declarations: [AppComponent, HelloComponent, SampleAuthorizedComponent],
  bootstrap: [AppComponent]
})
export class AppModule {}
