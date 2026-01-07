import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';

import { AuthGuard } from '../../core/guards/auth.guard';
import { ProfileViewComponent } from './profile-view/profile-view.component';
import { RatingDialogComponent } from './rating-dialog/rating-dialog.component';

const routes: Routes = [
  { path: ':id', component: ProfileViewComponent, canActivate: [AuthGuard] }
];

@NgModule({
  declarations: [
    ProfileViewComponent,
    RatingDialogComponent
  ],
  imports: [
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class ProfileModule { }
