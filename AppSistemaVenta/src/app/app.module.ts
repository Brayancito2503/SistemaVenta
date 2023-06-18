import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './Components/login/login.component';
import { LayoutComponent } from './Components/layout/layout.component';
import { MatDialogModule } from '@angular/material/dialog';


import { SharedModule } from './Reutilizable/shared/shared.module';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    LayoutComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatDialogModule,
    BrowserAnimationsModule,

    SharedModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
