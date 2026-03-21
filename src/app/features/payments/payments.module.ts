import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { PlansComponent } from './plans/plans.component';
import { AuthGuard } from '../../core/guards/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: 'planes', pathMatch: 'full' },
  { path: 'planes', component: PlansComponent, canActivate: [AuthGuard] }
];

@NgModule({
  declarations: [PlansComponent],
  imports: [SharedModule, RouterModule.forChild(routes)]
})
export class PaymentsModule {}
