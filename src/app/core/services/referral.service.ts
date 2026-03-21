import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ReferralService {
  private readonly API = `${environment.apiUrl}/referrals`;

  constructor(private http: HttpClient) {}

  getMyCode(): Observable<{ code: string; shareUrl: string }> {
    return this.http.get<{ code: string; shareUrl: string }>(`${this.API}/code`);
  }

  getStats(): Observable<any> {
    return this.http.get(`${this.API}/stats`);
  }

  validateCode(code: string): Observable<{ valid: boolean; code: string }> {
    return this.http.post<{ valid: boolean; code: string }>(`${this.API}/validate`, { code });
  }
}
