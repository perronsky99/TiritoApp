import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { PaymentService, PlanInfo, SubscriptionInfo } from '../../../core/services/payment.service';

@Component({
  selector: 'app-plans',
  template: `
    <div class="plans-container">
      <h2>Planes de Tirito App</h2>
      <p class="subtitle">Elegí el plan que mejor se adapte a tus necesidades</p>

      <app-loading-spinner *ngIf="loading"></app-loading-spinner>

      <div class="plans-grid" *ngIf="!loading">
        <mat-card *ngFor="let plan of plans" 
                  [class.current]="currentPlan === plan.id"
                  [class.recommended]="plan.id === 'pro'">
          <div class="plan-badge" *ngIf="plan.id === 'pro'">Recomendado</div>
          <mat-card-header>
            <mat-card-title>{{ plan.name }}</mat-card-title>
            <mat-card-subtitle *ngIf="currentPlan === plan.id">
              <mat-icon>check_circle</mat-icon> Plan actual
            </mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <div class="price">
              <span class="amount" *ngIf="plan.price > 0">\${{ plan.price }}</span>
              <span class="amount" *ngIf="plan.price === 0">Gratis</span>
              <span class="period" *ngIf="plan.price > 0">/mes</span>
            </div>
            <ul class="features">
              <li>
                <mat-icon>task_alt</mat-icon>
                Hasta {{ plan.maxActiveTiritos }} tirito(s) activo(s)
              </li>
              <li *ngFor="let feature of plan.features">
                <mat-icon>task_alt</mat-icon>
                {{ feature }}
              </li>
            </ul>
          </mat-card-content>
          <mat-card-actions>
            <button mat-raised-button 
                    [color]="plan.id === 'pro' ? 'primary' : 'basic'"
                    [disabled]="currentPlan === plan.id || subscribing"
                    (click)="selectPlan(plan)">
              {{ currentPlan === plan.id ? 'Plan actual' : (plan.price === 0 ? 'Gratis' : 'Seleccionar') }}
            </button>
          </mat-card-actions>
        </mat-card>
      </div>

      <!-- Usage info -->
      <mat-card class="usage-card" *ngIf="subscription">
        <mat-card-header>
          <mat-card-title>Tu uso actual</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <p>Tiritos activos: <strong>{{ subscription.usage.activeTiritos }}</strong> / {{ subscription.usage.maxActiveTiritos }}</p>
          <mat-progress-bar mode="determinate" 
                            [value]="(subscription.usage.activeTiritos / subscription.usage.maxActiveTiritos) * 100">
          </mat-progress-bar>
          <p *ngIf="subscription.subscription.endDate" class="end-date">
            Tu plan vence: {{ subscription.subscription.endDate | date:'longDate' }}
          </p>
        </mat-card-content>
        <mat-card-actions *ngIf="currentPlan !== 'free'">
          <button mat-button color="warn" (click)="cancel()">Cancelar suscripción</button>
        </mat-card-actions>
      </mat-card>

      <!-- Mock gateway dialog -->
      <div class="mock-overlay" *ngIf="showMockGateway">
        <mat-card class="mock-gateway">
          <mat-card-header>
            <mat-card-title>
              <mat-icon>payment</mat-icon> Pasarela de Pago
            </mat-card-title>
            <mat-card-subtitle>Simulación — No se realizarán cargos reales</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <div class="mock-processing" *ngIf="mockStep === 'processing'">
              <mat-spinner diameter="40"></mat-spinner>
              <p>Procesando pago de <strong>\${{ selectedPlan?.price }} USD</strong>...</p>
              <p class="hint">Plan {{ selectedPlan?.name }}</p>
            </div>
            <div class="mock-success" *ngIf="mockStep === 'success'">
              <mat-icon class="success-icon">check_circle</mat-icon>
              <h3>¡Pago simulado exitoso!</h3>
              <p>Tu plan ha sido actualizado a <strong>{{ selectedPlan?.name }}</strong></p>
              <p class="mock-notice">
                <mat-icon>info</mat-icon>
                Este es un pago simulado. En producción se conectará a una pasarela real.
              </p>
            </div>
          </mat-card-content>
          <mat-card-actions *ngIf="mockStep === 'success'">
            <button mat-raised-button color="primary" (click)="closeMockGateway()">Aceptar</button>
          </mat-card-actions>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .plans-container { max-width: 900px; margin: 24px auto; padding: 0 16px; }
    .subtitle { color: #666; margin-bottom: 24px; }
    .plans-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 16px; margin-bottom: 24px; }
    mat-card { position: relative; }
    mat-card.current { border: 2px solid #4caf50; }
    mat-card.recommended { border: 2px solid #1976d2; }
    .plan-badge { position: absolute; top: -12px; right: 16px; background: #1976d2; color: white; padding: 4px 12px; border-radius: 12px; font-size: 12px; }
    .price { text-align: center; margin: 16px 0; }
    .amount { font-size: 36px; font-weight: 700; }
    .period { font-size: 14px; color: #666; }
    .features { list-style: none; padding: 0; }
    .features li { display: flex; align-items: center; gap: 8px; margin: 8px 0; }
    .features mat-icon { color: #4caf50; font-size: 20px; width: 20px; height: 20px; }
    mat-card-actions { text-align: center; }
    .usage-card { margin-top: 24px; }
    .end-date { margin-top: 8px; color: #666; font-size: 13px; }
    .mock-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000; }
    .mock-gateway { max-width: 400px; width: 90%; text-align: center; padding: 24px; }
    .mock-processing { padding: 24px; display: flex; flex-direction: column; align-items: center; gap: 16px; }
    .mock-success { padding: 16px; }
    .success-icon { font-size: 64px; width: 64px; height: 64px; color: #4caf50; }
    .mock-notice { background: #fff3e0; padding: 12px; border-radius: 8px; margin-top: 16px; display: flex; align-items: center; gap: 8px; font-size: 13px; }
    .mock-notice mat-icon { color: #ff9800; }
  `]
})
export class PlansComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  plans: PlanInfo[] = [];
  subscription: SubscriptionInfo | null = null;
  currentPlan = 'free';
  loading = true;
  subscribing = false;

  // Mock gateway
  showMockGateway = false;
  mockStep: 'processing' | 'success' = 'processing';
  selectedPlan: PlanInfo | null = null;

  constructor(private paymentService: PaymentService, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading = true;
    this.paymentService.getPlans().pipe(takeUntil(this.destroy$)).subscribe({
      next: (res) => { this.plans = res.plans; this.loadSubscription(); },
      error: () => { this.loading = false; }
    });
  }

  loadSubscription(): void {
    this.paymentService.getSubscription().pipe(takeUntil(this.destroy$)).subscribe({
      next: (res) => {
        this.subscription = res;
        this.currentPlan = res.subscription.plan;
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  selectPlan(plan: PlanInfo): void {
    if (plan.price === 0 || plan.id === this.currentPlan) return;

    this.selectedPlan = plan;
    this.subscribing = true;
    this.showMockGateway = true;
    this.mockStep = 'processing';

    // Simular delay de pasarela
    this.paymentService.subscribe(plan.id, 'mock').pipe(takeUntil(this.destroy$)).subscribe({
      next: () => {
        setTimeout(() => {
          this.mockStep = 'success';
          this.currentPlan = plan.id;
          this.subscribing = false;
          this.loadSubscription();
        }, 2000);
      },
      error: (err) => {
        this.showMockGateway = false;
        this.subscribing = false;
        this.snackBar.open(err?.error?.message || 'Error procesando pago', 'Cerrar', { duration: 4000 });
      }
    });
  }

  closeMockGateway(): void {
    this.showMockGateway = false;
  }

  cancel(): void {
    if (!confirm('¿Estás seguro de cancelar tu suscripción? Volverás al plan Free.')) return;

    this.paymentService.cancelSubscription().pipe(takeUntil(this.destroy$)).subscribe({
      next: () => {
        this.snackBar.open('Suscripción cancelada', 'OK', { duration: 3000 });
        this.loadSubscription();
      },
      error: (err) => {
        this.snackBar.open(err?.error?.message || 'Error cancelando suscripción', 'Cerrar', { duration: 4000 });
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
