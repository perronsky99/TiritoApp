import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { User, RegisterData, AuthResponse } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly API_URL = `${environment.apiUrl}/auth`;
  private readonly TOKEN_KEY = 'tirito_jwt_token';
  private readonly USER_KEY = 'tirito_user';

  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser$: Observable<User | null>;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    const storedUser = localStorage.getItem(this.USER_KEY);
    this.currentUserSubject = new BehaviorSubject<User | null>(
      storedUser ? JSON.parse(storedUser) : null
    );
    this.currentUser$ = this.currentUserSubject.asObservable();

    // Migrar token viejo si existe
    const legacyToken = localStorage.getItem('token');
    if (legacyToken && !localStorage.getItem(this.TOKEN_KEY)) {
      localStorage.setItem(this.TOKEN_KEY, legacyToken);
      localStorage.removeItem('token');
    }
    const legacyUser = localStorage.getItem('user');
    if (legacyUser && !localStorage.getItem(this.USER_KEY)) {
      localStorage.setItem(this.USER_KEY, legacyUser);
      localStorage.removeItem('user');
    }
  }

  login(data: { email: string; password: string }): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.API_URL}/login`, data)
      .pipe(tap(res => this.setSession(res)));
  }

  register(payload: RegisterData): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.API_URL}/register`, payload)
      .pipe(tap(res => this.setSession(res)));
  }

  requestPasswordReset(email: string, captchaToken?: string): Observable<any> {
    const body: any = { email };
    if (captchaToken) body.captchaToken = captchaToken;
    return this.http.post<any>(`${this.API_URL}/password/request`, body);
  }

  resetPassword(token: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/password/reset`, { token, password });
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem(this.TOKEN_KEY);
  }

  get isLoggedIn(): boolean {
    return this.isAuthenticated();
  }

  get currentUser(): User | null {
    return this.currentUserSubject.value;
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  getUser(): User | null {
    return this.currentUserSubject.value;
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  private setSession(auth: AuthResponse): void {
    if (auth && auth.token && auth.user) {
      localStorage.setItem(this.TOKEN_KEY, auth.token);
      localStorage.setItem(this.USER_KEY, JSON.stringify(auth.user));
      this.currentUserSubject.next(auth.user);
    }
  }
}