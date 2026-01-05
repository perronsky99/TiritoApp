import { Component, Input } from '@angular/core';

/**
 * Componente de Loading Spinner reutilizable
 */
@Component({
  selector: 'app-loading-spinner',
  template: `
    <div class="loading-container" *ngIf="show">
      <mat-spinner [diameter]="size"></mat-spinner>
      <p class="loading-text" *ngIf="message">{{ message }}</p>
    </div>
  `,
  styles: [`
    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 2rem;
    }
    .loading-text {
      margin-top: 1rem;
      color: #666;
      font-size: 0.9rem;
    }
  `]
})
export class LoadingSpinnerComponent {
  @Input() show = true;
  @Input() size = 40;
  @Input() message?: string;
}
