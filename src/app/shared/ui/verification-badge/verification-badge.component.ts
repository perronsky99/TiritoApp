import { Component, Input } from '@angular/core';
import { VerificationStatus } from '../../../core/models';

/**
 * Badge de verificación de usuario
 */
@Component({
  selector: 'app-verification-badge',
  template: `
    <span 
      class="verification-badge" 
      [ngClass]="status"
      [matTooltip]="getTooltip()">
      <mat-icon *ngIf="status === 'verified'">verified</mat-icon>
      <mat-icon *ngIf="status === 'pending'">schedule</mat-icon>
    </span>
  `,
  styles: [`
    .verification-badge {
      display: inline-flex;
      align-items: center;
    }
    .verification-badge mat-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
    }
    .verified mat-icon {
      color: #4caf50;
    }
    .pending mat-icon {
      color: #ff9800;
    }
  `]
})
export class VerificationBadgeComponent {
  @Input() status: VerificationStatus = 'unverified';

  getTooltip(): string {
    switch (this.status) {
      case 'verified':
        return 'Usuario verificado';
      case 'pending':
        return 'Verificación pendiente';
      case 'rejected':
        return 'Verificación rechazada';
      default:
        return '';
    }
  }
}
