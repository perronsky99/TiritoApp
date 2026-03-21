import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { PaymentService, PlanInfo, SubscriptionInfo } from '../../../core/services/payment.service';

@Component({
  selector: 'app-plans',
  templateUrl: './plans.component.html',
  styleUrls: ['./plans.component.scss']
})
export class PlansComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  plans: PlanInfo[] = [];
  subscription: SubscriptionInfo | null = null;
  currentPlan = 'free';
  loading = true;
  subscribing = false;
  usagePercent = 0;

  // Mock gateway
  showMockGateway = false;
  mockStep: 'processing' | 'success' = 'processing';
  selectedPlan: PlanInfo | null = null;

  constructor(
    private paymentService: PaymentService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

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
        this.usagePercent = res.usage.maxActiveTiritos > 0
          ? Math.round((res.usage.activeTiritos / res.usage.maxActiveTiritos) * 100)
          : 0;
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
    if (this.mockStep === 'success') {
      this.router.navigate(['/tiritos/nuevo']);
    }
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
