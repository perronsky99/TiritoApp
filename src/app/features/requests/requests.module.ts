import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';

import { AuthGuard } from '../../core/guards/auth.guard';
import { RequestsInboxComponent } from './requests-inbox/requests-inbox.component';
import { MyRequestsComponent } from './my-requests/my-requests.component';
import { RequestsUnifiedComponent } from './requests-unified/requests-unified.component';

const routes: Routes = [
  // Ruta principal unificada
  { path: '', component: RequestsUnifiedComponent, canActivate: [AuthGuard] },
  // Rutas legacy (redirigen a la unificada)
  { path: 'enviadas', redirectTo: '?tab=enviadas', pathMatch: 'full' },
  { path: 'recibidas', redirectTo: '?tab=recibidas', pathMatch: 'full' }
];

@NgModule({
  declarations: [
    RequestsInboxComponent,
    MyRequestsComponent,
    RequestsUnifiedComponent
  ],
  imports: [
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class RequestsModule { }
