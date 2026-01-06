import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, interval, of, Subscription } from 'rxjs';
import { tap, switchMap, startWith, catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { io, Socket } from 'socket.io-client';

/**
 * Tipos de notificación
 */
export type NotificationType = 'chat_new' | 'chat_message' | 'tirito_interest';

/**
 * Interface de Notificación
 */
export interface INotification {
  _id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  fromUserId: {
    _id: string;
    name: string;
    email: string;
  };
  tiritoId?: {
    _id: string;
    title: string;
  };
  chatId?: string;
  actionUrl: string;
  read: boolean;
  createdAt: string;
}

/**
 * Respuesta de lista de notificaciones
 */
export interface NotificationsResponse {
  notifications: INotification[];
  total: number;
  unreadCount: number;
}

/**
 * Servicio de Notificaciones
 * Gestiona el buzón de notificaciones y el contador de no leídas
 */
@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private readonly API_URL = `${environment.apiUrl}/notifications`;

  // Contador de no leídas (reactivo)
  private unreadCountSubject = new BehaviorSubject<number>(0);
  public unreadCount$ = this.unreadCountSubject.asObservable();

  // Lista de notificaciones
  private notificationsSubject = new BehaviorSubject<INotification[]>([]);
  public notifications$ = this.notificationsSubject.asObservable();

  // Polling interval (30 segundos)
  private readonly POLL_INTERVAL = 30000;
  private pollingSubscription: Subscription | null = null;
  private socket: Socket | null = null;

  constructor(private http: HttpClient) {}

  /**
   * Inicia el polling de notificaciones
   * Llamar cuando el usuario se autentique
   */
  startPolling(): void {
    // Evitar múltiples suscripciones
    if (this.pollingSubscription) {
      return;
    }

    this.pollingSubscription = interval(this.POLL_INTERVAL)
      .pipe(
        startWith(0),
        switchMap(() => this.getUnreadCount().pipe(
          catchError(() => of({ unreadCount: 0 }))
        ))
      )
      .subscribe();

    // Also connect socket for real-time updates
    this.connectSocket();
  }

  /**
   * Detiene el polling de notificaciones
   * Llamar cuando el usuario cierre sesión
   */
  stopPolling(): void {
    if (this.pollingSubscription) {
      this.pollingSubscription.unsubscribe();
      this.pollingSubscription = null;
    }

    this.disconnectSocket();
  }

  private connectSocket(): void {
    try {
      if (this.socket) return;
      const base = environment.apiUrl.replace(/\/api\/?$/, '');
      // connect with autoConnect false to control when to register
      const token = localStorage.getItem('tirito_jwt_token');
      this.socket = io(base, { autoConnect: true, auth: { token } });

      this.socket.on('connect', () => {
        // register with current user id if available
        const stored = localStorage.getItem('tirito_user');
          const token = localStorage.getItem('tirito_jwt_token');
          if (stored) {
            const user = JSON.parse(stored);
            this.socket?.emit('register', user.id || user._id);
          }
      });

      this.socket.on('notification', (payload: any) => {
        // Push into subjects
        const current = this.notificationsSubject.value || [];
        this.notificationsSubject.next([payload, ...current]);
        const unread = this.unreadCountSubject.value + (payload.read ? 0 : 1);
        this.unreadCountSubject.next(unread);
      });
    } catch (err) {
      console.warn('Socket connect error', err);
    }
  }

  private disconnectSocket(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  /**
   * Obtiene las notificaciones del usuario
   */
  getNotifications(unreadOnly = false, limit = 20, skip = 0): Observable<NotificationsResponse> {
    const params: any = { limit, skip };
    if (unreadOnly) params.unreadOnly = 'true';

    return this.http.get<NotificationsResponse>(this.API_URL, { params }).pipe(
      tap(response => {
        this.notificationsSubject.next(response.notifications);
        this.unreadCountSubject.next(response.unreadCount);
      })
    );
  }

  /**
   * Obtiene solo el contador de no leídas
   */
  getUnreadCount(): Observable<{ unreadCount: number }> {
    return this.http.get<{ unreadCount: number }>(`${this.API_URL}/unread-count`).pipe(
      tap(response => {
        this.unreadCountSubject.next(response.unreadCount);
      })
    );
  }

  /**
   * Marca una notificación como leída
   */
  markAsRead(notificationId: string): Observable<any> {
    return this.http.put(`${this.API_URL}/${notificationId}/read`, {}).pipe(
      tap(() => {
        // Actualizar lista local
        const current = this.notificationsSubject.value;
        const updated = current.map(n =>
          n._id === notificationId ? { ...n, read: true } : n
        );
        this.notificationsSubject.next(updated);

        // Decrementar contador
        const currentCount = this.unreadCountSubject.value;
        if (currentCount > 0) {
          this.unreadCountSubject.next(currentCount - 1);
        }
      })
    );
  }

  /**
   * Marca todas las notificaciones como leídas
   */
  markAllAsRead(): Observable<any> {
    return this.http.put(`${this.API_URL}/read-all`, {}).pipe(
      tap(() => {
        // Actualizar lista local
        const current = this.notificationsSubject.value;
        const updated = current.map(n => ({ ...n, read: true }));
        this.notificationsSubject.next(updated);

        // Resetear contador
        this.unreadCountSubject.next(0);
      })
    );
  }

  /**
   * Elimina una notificación
   */
  deleteNotification(notificationId: string): Observable<any> {
    return this.http.delete(`${this.API_URL}/${notificationId}`).pipe(
      tap(() => {
        // Remover de lista local
        const current = this.notificationsSubject.value;
        const notification = current.find(n => n._id === notificationId);
        const updated = current.filter(n => n._id !== notificationId);
        this.notificationsSubject.next(updated);

        // Decrementar contador si no estaba leída
        if (notification && !notification.read) {
          const currentCount = this.unreadCountSubject.value;
          if (currentCount > 0) {
            this.unreadCountSubject.next(currentCount - 1);
          }
        }
      })
    );
  }

  /**
   * Actualiza el contador manualmente
   */
  refreshUnreadCount(): void {
    this.getUnreadCount().pipe(
      catchError(() => of({ unreadCount: 0 }))
    ).subscribe();
  }

  /**
   * Resetea el estado (llamar al hacer logout)
   */
  reset(): void {
    this.stopPolling();
    this.unreadCountSubject.next(0);
    this.notificationsSubject.next([]);
  }
}
