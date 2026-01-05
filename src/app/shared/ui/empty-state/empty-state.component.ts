import { Component, Input } from '@angular/core';

/**
 * Componente para mostrar estado vacío
 */
@Component({
  selector: 'app-empty-state',
  template: `
    <div class="empty-container">
      <mat-icon class="empty-icon">{{ icon }}</mat-icon>
      <h3 class="empty-title">{{ title }}</h3>
      <p class="empty-message">{{ message }}</p>
      <ng-content></ng-content>
    </div>
  `,
  styles: [`
    .empty-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 3rem 2rem;
      text-align: center;
    }
    .empty-icon {
      font-size: 64px;
      width: 64px;
      height: 64px;
      color: #ccc;
      margin-bottom: 1rem;
    }
    .empty-title {
      margin: 0 0 0.5rem;
      color: #333;
    }
    .empty-message {
      color: #666;
      margin-bottom: 1.5rem;
      max-width: 300px;
    }
  `]
})
export class EmptyStateComponent {
  @Input() icon = 'inbox';
  @Input() title = 'No hay nada aquí';
  @Input() message = '';
}
