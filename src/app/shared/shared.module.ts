import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Angular Material
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatBadgeModule } from '@angular/material/badge';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatStepperModule } from '@angular/material/stepper';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { HttpClientModule } from '@angular/common/http';

// UI Components
import { LoadingSpinnerComponent } from './ui/loading-spinner/loading-spinner.component';
import { ErrorStateComponent } from './ui/error-state/error-state.component';
import { EmptyStateComponent } from './ui/empty-state/empty-state.component';
import { VerificationBadgeComponent } from './ui/verification-badge/verification-badge.component';
import { TiritoStatusBadgeComponent } from './ui/tirito-status-badge/tirito-status-badge.component';
import { ImageUploadComponent } from './ui/image-upload/image-upload.component';
import { NotificationDropdownComponent } from './ui/notification-dropdown/notification-dropdown.component';
import { RatingDialogComponent } from '../features/profile/rating-dialog/rating-dialog.component';
import { SearchBarComponent } from '../core/components/search-bar/search-bar.component';
import { ReportModalComponent } from './ui/report-modal/report-modal.component';
import { BanModalComponent } from './ui/ban-modal/ban-modal.component';

// Pipes
import { RelativeTimePipe } from './pipes/relative-time.pipe';
import { TruncatePipe } from './pipes/truncate.pipe';

const MATERIAL_MODULES = [
  MatButtonModule,
  MatIconModule,
  MatProgressSpinnerModule,
  MatTooltipModule,
  MatInputModule,
  MatFormFieldModule,
  MatButtonToggleModule,
  MatCardModule,
  MatChipsModule,
  MatMenuModule,
  MatDialogModule,
  MatSnackBarModule,
  MatBadgeModule,
  MatSelectModule,
  MatToolbarModule,
  MatTabsModule,
  MatSidenavModule,
  MatListModule,
  MatDatepickerModule,
  MatNativeDateModule
  ,MatStepperModule,
  MatProgressBarModule,
  MatCheckboxModule
];

const UI_COMPONENTS = [
  LoadingSpinnerComponent,
  ErrorStateComponent,
  EmptyStateComponent,
  VerificationBadgeComponent,
  TiritoStatusBadgeComponent,
  ImageUploadComponent,
  NotificationDropdownComponent,
  RatingDialogComponent,
  SearchBarComponent
  ,ReportModalComponent
  ,BanModalComponent
];

const PIPES = [
  RelativeTimePipe,
  TruncatePipe
];

/**
 * Shared Module - Se importa en cada feature module
 * Contiene componentes UI reutilizables, pipes y módulos de Material
 */
@NgModule({
  declarations: [
    ...UI_COMPONENTS,
    ...PIPES
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    ...MATERIAL_MODULES,
    HttpClientModule
  ],
  exports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    ...MATERIAL_MODULES,
    ...UI_COMPONENTS,
    ...PIPES
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'es-VE' }
  ]
})
export class SharedModule { }
