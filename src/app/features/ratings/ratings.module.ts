import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { PendingRatingsComponent } from './pending-ratings/pending-ratings.component';
import { AuthGuard } from '../../core/guards/auth.guard';

const routes: Routes = [
  { path: '', component: PendingRatingsComponent, canActivate: [AuthGuard] }
];

@NgModule({
  declarations: [PendingRatingsComponent],
  imports: [SharedModule, RouterModule.forChild(routes)]
})
export class RatingsModule {}
