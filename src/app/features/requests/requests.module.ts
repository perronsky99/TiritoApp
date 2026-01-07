import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';

import { AuthGuard } from '../../core/guards/auth.guard';
import { RequestsInboxComponent } from './requests-inbox/requests-inbox.component';
import { MyRequestsComponent } from './my-requests/my-requests.component';

const routes: Routes = [
  { path: '', component: RequestsInboxComponent, canActivate: [AuthGuard] },
  { path: 'enviadas', component: MyRequestsComponent, canActivate: [AuthGuard] }
];

@NgModule({
  declarations: [
    RequestsInboxComponent,
    MyRequestsComponent
  ],
  imports: [
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class RequestsModule { }
