import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NotificationsRoutingModule } from './notifications-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { NotificationsListComponent } from './notifications-list/notifications-list.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule as IconModule } from '@angular/material/icon';
import { CommonModule as CM } from '@angular/common';

@NgModule({
  declarations: [NotificationsListComponent],
  imports: [
    CommonModule,
    SharedModule,
    NotificationsRoutingModule,
    IconModule,
    MatButtonModule,
    MatListModule,
    MatDividerModule,
    MatProgressSpinnerModule
    ,MatSnackBarModule
  ]
})
export class NotificationsModule {}
