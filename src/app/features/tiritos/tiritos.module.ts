import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';

import { AuthGuard } from '../../core/guards/auth.guard';
import { TiritosListComponent } from './tiritos-list/tiritos-list.component';
import { TiritoDetailComponent } from './tirito-detail/tirito-detail.component';
import { TiritoCreateComponent } from './tirito-create/tirito-create.component';

const routes: Routes = [
  { path: '', component: TiritosListComponent },
  { path: 'nuevo', component: TiritoCreateComponent, canActivate: [AuthGuard] },
  { path: ':id', component: TiritoDetailComponent }
];

@NgModule({
  declarations: [
    TiritosListComponent,
    TiritoDetailComponent,
    TiritoCreateComponent
  ],
  imports: [
    SharedModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule.forChild(routes)
  ]
})
export class TiritosModule { }
