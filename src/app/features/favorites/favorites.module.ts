import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { FavoritesPageComponent } from './favorites-page/favorites-page.component';

@NgModule({
  declarations: [FavoritesPageComponent],
  imports: [CommonModule, SharedModule, RouterModule.forChild([
    { path: '', component: FavoritesPageComponent }
  ])]
})
export class FavoritesModule {}
