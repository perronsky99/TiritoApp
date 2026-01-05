import { Component, Input } from '@angular/core';
import { TiritoStatus } from '../../../core/models';

/**
 * Badge de estado del Tirito
 */
@Component({
  selector: 'app-tirito-status-badge',
  template: `
    <span class="status-badge" [ngClass]="status">
      {{ getLabel() }}
    </span>
  `,
  styles: [`
    .status-badge {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 16px;
      font-size: 12px;
      font-weight: 500;
      text-transform: uppercase;
    }
    .open {
      background-color: #e3f2fd;
      color: #1976d2;
    }
    .in_progress {
      background-color: #fff3e0;
      color: #f57c00;
    }
    .closed {
      background-color: #f5f5f5;
      color: #757575;
    }
  `]
})
export class TiritoStatusBadgeComponent {
  @Input() status: TiritoStatus = 'open';

  getLabel(): string {
    switch (this.status) {
      case 'open':
        return 'Abierto';
      case 'in_progress':
        return 'En progreso';
      case 'closed':
        return 'Cerrado';
      default:
        return '';
    }
  }
}
