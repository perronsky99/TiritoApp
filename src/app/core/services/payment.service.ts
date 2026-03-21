import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface PlanInfo {
  id: string;
  name: string;
  maxActiveTiritos: number;
  price: number;
  currency: string;
  features: string[];
}

export interface SubscriptionInfo {
  subscription: {
    plan: string;
    status: string;
    startDate: string;
    endDate: string;
    autoRenew: boolean;
  };
  limits: PlanInfo;
  usage: {
    activeTiritos: number;
    maxActiveTiritos: number;
    canCreateMore: boolean;
  };
}

@Injectable({ providedIn: 'root' })
export class PaymentService {
  private readonly API = `${environment.apiUrl}/payments`;

  constructor(private http: HttpClient) {}

  getPlans(): Observable<{ plans: PlanInfo[] }> {
    return this.http.get<{ plans: PlanInfo[] }>(`${this.API}/plans`);
  }

  getSubscription(): Observable<SubscriptionInfo> {
    return this.http.get<SubscriptionInfo>(`${this.API}/subscription`);
  }

  subscribe(plan: string, paymentMethod?: string): Observable<any> {
    return this.http.post(`${this.API}/subscribe`, { plan, paymentMethod });
  }

  cancelSubscription(): Observable<any> {
    return this.http.post(`${this.API}/cancel`, {});
  }

  getTransactions(page = 1): Observable<any> {
    return this.http.get(`${this.API}/transactions`, { params: { page: page.toString() } });
  }

  payForTirito(tiritoId: string, paymentMethod?: string): Observable<any> {
    return this.http.post(`${this.API}/tirito/${tiritoId}/pay`, { paymentMethod });
  }
}
