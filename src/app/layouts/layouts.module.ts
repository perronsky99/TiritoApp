import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';

import { MainLayoutComponent } from './main-layout/main-layout.component';

@NgModule({
  declarations: [
    MainLayoutComponent
  ],
  imports: [
    SharedModule,
    RouterModule
  ],
  exports: [
    MainLayoutComponent
  ]
})
export class LayoutsModule { }
