import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface IUser {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'worker' | 'business';
  verificationStatus: 'unverified' | 'pending' | 'verified' | 'rejected';
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly API = environment.apiUrl + '/auth';
  private currentUserSubject = new BehaviorSubject<IUser | null>(this.getUserFromStorage());
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {}

  register(data: { name: string; email: string; password: string; role?: string }): Observable<any> {
    return this.http.post<any>(`${this.API}/register`, data).pipe(
      tap(res => this.handleAuth(res))
    );
  }

  requestPasswordReset(email: string): Observable<any> {
    return this.http.post<any>(`${this.API}/password/request`, { email });
  }

  resetPassword(token: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.API}/password/reset`, { token, password });
  }

  login(data: { email: string; password: string }): Observable<any> {
    return this.http.post<any>(`${this.API}/login`, data).pipe(
      tap(res => this.handleAuth(res))
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.currentUserSubject.next(null);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getUser(): IUser | null {
    return this.currentUserSubject.value;
  }

  private handleAuth(res: any) {
    if (res && res.token && res.user) {
      localStorage.setItem('token', res.token);
      localStorage.setItem('user', JSON.stringify(res.user));
      this.currentUserSubject.next(res.user);
    }
  }

  private getUserFromStorage(): IUser | null {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
}
