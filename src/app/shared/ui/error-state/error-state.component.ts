import { Component, Input, Output, EventEmitter } from '@angular/core';

/**
 * Componente para mostrar estados de error
 */
@Component({
  selector: 'app-error-state',
  template: `
    <div class="error-container">
      <mat-icon class="error-icon">error_outline</mat-icon>
      <h3 class="error-title">{{ title }}</h3>
      <p class="error-message">{{ message }}</p>
      <button 
        mat-raised-button 
        color="primary" 
        *ngIf="showRetry"
        (click)="retry.emit()">
        Reintentar
      </button>
    </div>
  `,
  styles: [`
    .error-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 2rem;
      text-align: center;
    }
    .error-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      color: #f44336;
      margin-bottom: 1rem;
    }
    .error-title {
      margin: 0 0 0.5rem;
      color: #333;
    }
    .error-message {
      color: #666;
      margin-bottom: 1rem;
    }
  `]
})
export class ErrorStateComponent {
  @Input() title = 'Ocurrió un error';
  @Input() message = 'No pudimos completar la operación. Por favor, intentá de nuevo.';
  @Input() showRetry = true;
  @Output() retry = new EventEmitter<void>();
}
