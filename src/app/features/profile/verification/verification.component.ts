import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { VerificationService } from '../../../core/services/verification.service';

@Component({
  selector: 'app-verification',
  template: `
    <div class="verification-container">
      <h2>Verificación de identidad</h2>
      <p class="subtitle">Verificá tu cuenta para generar más confianza en la comunidad</p>

      <mat-card *ngIf="status">
        <mat-card-header>
          <mat-card-title>Estado actual</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <div class="status-badge" [ngClass]="status.verificationStatus">
            <mat-icon>{{ statusIcon }}</mat-icon>
            <span>{{ statusText }}</span>
          </div>
          <p *ngIf="status.latestRequest?.rejectionReason" class="rejection-reason">
            <strong>Motivo:</strong> {{ status.latestRequest.rejectionReason }}
          </p>
        </mat-card-content>
      </mat-card>

      <mat-card *ngIf="status?.verificationStatus !== 'verified' && status?.verificationStatus !== 'pending'" class="upload-card">
        <mat-card-header>
          <mat-card-title>Enviar documentos</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <p>Necesitás subir 3 imágenes:</p>
          <ol>
            <li>Frente de tu cédula de identidad</li>
            <li>Reverso de tu cédula de identidad</li>
            <li>Selfie sosteniendo tu cédula</li>
          </ol>
          
          <div class="file-inputs">
            <div *ngFor="let label of ['Frente del documento', 'Reverso del documento', 'Selfie con documento']; let i = index"
                 class="file-input">
              <label>{{ label }}</label>
              <input type="file" accept="image/jpeg,image/png,application/pdf" (change)="onFileSelected($event, i)">
              <span class="file-name" *ngIf="files[i]">{{ files[i]?.name }}</span>
            </div>
          </div>
        </mat-card-content>
        <mat-card-actions>
          <button mat-raised-button color="primary" 
                  [disabled]="!canSubmit"
                  (click)="submit()">
            <mat-icon>upload</mat-icon>
            {{ submitting ? 'Enviando...' : 'Enviar documentos' }}
          </button>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: [`
    .verification-container { max-width: 600px; margin: 24px auto; padding: 0 16px; }
    .subtitle { color: #666; margin-bottom: 24px; }
    .status-badge { display: flex; align-items: center; gap: 8px; padding: 12px; border-radius: 8px; font-weight: 500; }
    .status-badge.unverified { background: #fff3e0; color: #e65100; }
    .status-badge.pending { background: #e3f2fd; color: #1565c0; }
    .status-badge.verified { background: #e8f5e9; color: #2e7d32; }
    .status-badge.rejected { background: #fce4ec; color: #c62828; }
    .rejection-reason { margin-top: 12px; padding: 12px; background: #fce4ec; border-radius: 8px; }
    .upload-card { margin-top: 16px; }
    .file-inputs { margin: 16px 0; }
    .file-input { margin-bottom: 16px; }
    .file-input label { display: block; font-weight: 500; margin-bottom: 4px; }
    .file-name { font-size: 12px; color: #666; }
  `]
})
export class VerificationComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  status: any = null;
  files: (File | null)[] = [null, null, null];
  submitting = false;

  get canSubmit(): boolean {
    return this.files.filter(f => f !== null).length >= 3 && !this.submitting;
  }

  get statusIcon(): string {
    const icons: any = { unverified: 'warning', pending: 'hourglass_empty', verified: 'verified', rejected: 'cancel' };
    return icons[this.status?.verificationStatus] || 'help';
  }

  get statusText(): string {
    const texts: any = { unverified: 'Sin verificar', pending: 'En revisión', verified: 'Verificado', rejected: 'Rechazado' };
    return texts[this.status?.verificationStatus] || 'Desconocido';
  }

  constructor(private verificationService: VerificationService, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.loadStatus();
  }

  loadStatus(): void {
    this.verificationService.getStatus().pipe(takeUntil(this.destroy$)).subscribe({
      next: (res) => this.status = res,
      error: () => {}
    });
  }

  onFileSelected(event: Event, index: number): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.files[index] = input.files[0];
    }
  }

  submit(): void {
    const validFiles = this.files.filter((f): f is File => f !== null);
    if (validFiles.length < 3) return;

    this.submitting = true;
    this.verificationService.submitDocuments(validFiles).pipe(takeUntil(this.destroy$)).subscribe({
      next: () => {
        this.submitting = false;
        this.snackBar.open('Documentos enviados exitosamente', 'OK', { duration: 4000 });
        this.loadStatus();
      },
      error: (err) => {
        this.submitting = false;
        this.snackBar.open(err?.error?.message || 'Error enviando documentos', 'Cerrar', { duration: 4000 });
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
