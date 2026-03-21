import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';

import { AuthGuard } from '../../core/guards/auth.guard';
import { ProfileViewComponent } from './profile-view/profile-view.component';
import { VerificationComponent } from './verification/verification.component';
import { ReferralsComponent } from './referrals/referrals.component';

const routes: Routes = [
  { path: 'verificacion', component: VerificationComponent, canActivate: [AuthGuard] },
  { path: 'referidos', component: ReferralsComponent, canActivate: [AuthGuard] },
  { path: ':id', component: ProfileViewComponent, canActivate: [AuthGuard] }
];

@NgModule({
  declarations: [
    ProfileViewComponent,
    VerificationComponent,
    ReferralsComponent
  ],
  imports: [
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class ProfileModule { }
