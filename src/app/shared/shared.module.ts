import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Angular Material
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatBadgeModule } from '@angular/material/badge';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';

// UI Components
import { LoadingSpinnerComponent } from './ui/loading-spinner/loading-spinner.component';
import { ErrorStateComponent } from './ui/error-state/error-state.component';
import { EmptyStateComponent } from './ui/empty-state/empty-state.component';
import { VerificationBadgeComponent } from './ui/verification-badge/verification-badge.component';
import { TiritoStatusBadgeComponent } from './ui/tirito-status-badge/tirito-status-badge.component';
import { ImageUploadComponent } from './ui/image-upload/image-upload.component';

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
  MatCardModule,
  MatChipsModule,
  MatMenuModule,
  MatDialogModule,
  MatSnackBarModule,
  MatBadgeModule,
  MatSelectModule,
  MatToolbarModule,
  MatSidenavModule,
  MatListModule
];

const UI_COMPONENTS = [
  LoadingSpinnerComponent,
  ErrorStateComponent,
  EmptyStateComponent,
  VerificationBadgeComponent,
  TiritoStatusBadgeComponent,
  ImageUploadComponent
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
    ...MATERIAL_MODULES
  ],
  exports: [
    CommonModule,
    ...MATERIAL_MODULES,
    ...UI_COMPONENTS,
    ...PIPES
  ]
})
export class SharedModule { }
