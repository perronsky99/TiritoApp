import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';

import { MainLayoutComponent } from './main-layout/main-layout.component';
import { FavoritesDrawerComponent } from './favorites-drawer/favorites-drawer.component';

@NgModule({
  declarations: [
    MainLayoutComponent,
    FavoritesDrawerComponent
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
