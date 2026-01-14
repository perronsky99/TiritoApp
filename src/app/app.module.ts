import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { CoreModule } from './core/core.module';
import { LayoutsModule } from './layouts/layouts.module';

import { AppComponent } from './app.component';
import { AdminAuditsComponent } from './features/admin/admin-audits/admin-audits.component';
import { AdminReportsComponent } from './features/admin/admin-reports/admin-reports.component';

@NgModule({
  declarations: [
    AppComponent,
    AdminAuditsComponent,
    AdminReportsComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    AppRoutingModule,
    CoreModule,
    LayoutsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
