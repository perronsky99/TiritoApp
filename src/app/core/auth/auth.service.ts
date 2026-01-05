import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, map, catchError, of } from 'rxjs';
import { Router } from '@angular/router';
import { 
  User, 
  LoginCredentials, 
  RegisterData, 
  AuthResponse 
} from '../models';
import { environment } from '../../../environments/environment';

/**
 * Servicio de autenticación
 * Maneja login, registro, logout y estado del usuario
 * El backend SIEMPRE valida - el frontend solo orquesta
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = `${environment.apiUrl}/auth`;
  private readonly TOKEN_KEY = 'tirito_access_token';
  private readonly REFRESH_TOKEN_KEY = 'tirito_refresh_token';
  private readonly USER_KEY = 'tirito_user';

  private currentUserSubject = new BehaviorSubject<User | null>(this.getStoredUser());
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  /**
   * Usuario actual
   */
  get currentUser(): User | null {
    return this.currentUserSubject.value;
  }

  /**
   * Verifica si hay usuario logueado
   */
  get isLoggedIn(): boolean {
    return !!this.getToken();
  }

  /**
   * Login con email y password
   */
  login(credentials: LoginCredentials): Observable<User> {
    return this.http.post<AuthResponse>(`${this.API_URL}/login`, credentials)
      .pipe(
        tap(response => this.handleAuthResponse(response)),
        map(response => response.user)
      );
  }

  /**
   * Registro de nuevo usuario
   */
  register(data: RegisterData): Observable<User> {
    return this.http.post<AuthResponse>(`${this.API_URL}/register`, data)
      .pipe(
        tap(response => this.handleAuthResponse(response)),
        map(response => response.user)
      );
  }

  /**
   * Cierra sesión y limpia datos locales
   */
  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  /**
   * Obtiene el token de acceso actual
   */
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  /**
   * Refresca el token de acceso
   */
  refreshToken(): Observable<string | null> {
    const refreshToken = localStorage.getItem(this.REFRESH_TOKEN_KEY);
    
    if (!refreshToken) {
      return of(null);
    }

    return this.http.post<AuthResponse>(`${this.API_URL}/refresh`, { refreshToken })
      .pipe(
        tap(response => this.handleAuthResponse(response)),
        map(response => response.accessToken),
        catchError(() => {
          this.logout();
          return of(null);
        })
      );
  }

  /**
   * Verifica el estado de autenticación al iniciar la app
   */
  checkAuthStatus(): Observable<User | null> {
    const token = this.getToken();
    
    if (!token) {
      return of(null);
    }

    return this.http.get<User>(`${this.API_URL}/me`)
      .pipe(
        tap(user => {
          this.currentUserSubject.next(user);
          this.storeUser(user);
        }),
        catchError(() => {
          this.logout();
          return of(null);
        })
      );
  }

  /**
   * Maneja la respuesta de autenticación
   */
  private handleAuthResponse(response: AuthResponse): void {
    localStorage.setItem(this.TOKEN_KEY, response.accessToken);
    localStorage.setItem(this.REFRESH_TOKEN_KEY, response.refreshToken);
    this.storeUser(response.user);
    this.currentUserSubject.next(response.user);
  }

  /**
   * Guarda el usuario en localStorage
   */
  private storeUser(user: User): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  /**
   * Obtiene el usuario almacenado
   */
  private getStoredUser(): User | null {
    const userJson = localStorage.getItem(this.USER_KEY);
    return userJson ? JSON.parse(userJson) : null;
  }
}
