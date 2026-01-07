import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';

import { AuthGuard } from '../../core/guards/auth.guard';
import { RequestsInboxComponent } from './requests-inbox/requests-inbox.component';

const routes: Routes = [
  { path: '', component: RequestsInboxComponent, canActivate: [AuthGuard] }
];

@NgModule({
  declarations: [
    RequestsInboxComponent
  ],
  imports: [
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class RequestsModule { }
