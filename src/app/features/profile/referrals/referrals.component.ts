import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ReferralService } from '../../../core/services/referral.service';

@Component({
  selector: 'app-referrals',
  template: `
    <div class="referrals-container">
      <h2>Programa de Referidos</h2>
      <p class="subtitle">Invitá amigos y ganá recompensas cuando usen Tirito App</p>

      <mat-card class="code-card" *ngIf="referralCode">
        <mat-card-header>
          <mat-card-title>Tu código de referido</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <div class="code-display">
            <span class="code">{{ referralCode }}</span>
            <button mat-icon-button (click)="copyCode()" matTooltip="Copiar código">
              <mat-icon>content_copy</mat-icon>
            </button>
          </div>
          <div class="share-section">
            <p>Compartí este link:</p>
            <div class="share-url">
              <input readonly [value]="shareUrl" #urlInput>
              <button mat-icon-button (click)="copyUrl()" matTooltip="Copiar link">
                <mat-icon>link</mat-icon>
              </button>
            </div>
          </div>
        </mat-card-content>
      </mat-card>

      <mat-card class="stats-card" *ngIf="stats">
        <mat-card-header>
          <mat-card-title>Tus estadísticas</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <div class="stats-grid">
            <div class="stat">
              <span class="stat-value">{{ stats.totalReferred }}</span>
              <span class="stat-label">Invitados</span>
            </div>
            <div class="stat">
              <span class="stat-value">{{ stats.registered }}</span>
              <span class="stat-label">Registrados</span>
            </div>
            <div class="stat">
              <span class="stat-value">{{ stats.completedFirstTirito }}</span>
              <span class="stat-label">Activos</span>
            </div>
            <div class="stat">
              <span class="stat-value">\${{ stats.totalRewardsEarned }}</span>
              <span class="stat-label">Ganado</span>
            </div>
          </div>
        </mat-card-content>
      </mat-card>

      <mat-card *ngIf="referrals.length > 0">
        <mat-card-header>
          <mat-card-title>Historial de referidos</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <mat-list>
            <mat-list-item *ngFor="let ref of referrals">
              <mat-icon matListItemIcon>person</mat-icon>
              <span matListItemTitle>{{ ref.referredId?.username || 'Usuario' }}</span>
              <span matListItemLine>{{ ref.status }} · {{ ref.createdAt | date:'shortDate' }}</span>
            </mat-list-item>
          </mat-list>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .referrals-container { max-width: 600px; margin: 24px auto; padding: 0 16px; }
    .subtitle { color: #666; margin-bottom: 24px; }
    .code-card, .stats-card { margin-bottom: 16px; }
    .code-display { display: flex; align-items: center; gap: 12px; margin: 16px 0; }
    .code { font-size: 28px; font-weight: 700; letter-spacing: 2px; color: #1976d2; }
    .share-url { display: flex; align-items: center; gap: 8px; }
    .share-url input { flex: 1; padding: 8px 12px; border: 1px solid #ddd; border-radius: 8px; font-size: 13px; }
    .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; text-align: center; margin: 16px 0; }
    .stat-value { display: block; font-size: 24px; font-weight: 700; color: #1976d2; }
    .stat-label { font-size: 12px; color: #666; }
    @media (max-width: 480px) { .stats-grid { grid-template-columns: repeat(2, 1fr); } }
  `]
})
export class ReferralsComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  referralCode = '';
  shareUrl = '';
  stats: any = null;
  referrals: any[] = [];

  constructor(private referralService: ReferralService, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.referralService.getMyCode().pipe(takeUntil(this.destroy$)).subscribe({
      next: (res) => { this.referralCode = res.code; this.shareUrl = res.shareUrl; },
      error: () => {}
    });

    this.referralService.getStats().pipe(takeUntil(this.destroy$)).subscribe({
      next: (res) => { this.stats = res.stats; this.referrals = res.referrals || []; },
      error: () => {}
    });
  }

  copyCode(): void {
    navigator.clipboard.writeText(this.referralCode).then(() => {
      this.snackBar.open('Código copiado', undefined, { duration: 2000 });
    });
  }

  copyUrl(): void {
    navigator.clipboard.writeText(this.shareUrl).then(() => {
      this.snackBar.open('Link copiado', undefined, { duration: 2000 });
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
