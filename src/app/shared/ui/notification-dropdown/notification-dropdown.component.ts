import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { NotificationService, INotification } from '../../../core/services/notification.service';

/**
 * Componente de buzón de notificaciones
 * Se usa como dropdown en el navbar
 */
@Component({
  selector: 'app-notification-dropdown',
  templateUrl: './notification-dropdown.component.html',
  styleUrls: ['./notification-dropdown.component.scss']
})
export class NotificationDropdownComponent implements OnInit, OnDestroy {
  notifications: INotification[] = [];
  unreadCount = 0;
  loading = false;
  isOpen = false;

  private destroy$ = new Subject<void>();

  constructor(
    private notificationService: NotificationService,
    private router: Router
  ) {}
  

  ngOnInit(): void {
    // Suscribirse al contador de no leídas
    this.notificationService.unreadCount$
      .pipe(takeUntil(this.destroy$))
      .subscribe(count => {
        this.unreadCount = count;
      });

    // Suscribirse a la lista de notificaciones
    this.notificationService.notifications$
      .pipe(takeUntil(this.destroy$))
      .subscribe(notifications => {
        this.notifications = notifications;
      });

    // Cargar contador inicial
    this.notificationService.refreshUnreadCount();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  toggleDropdown(): void {
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      this.loadNotifications();
    }
  }

  closeDropdown(): void {
    this.isOpen = false;
  }

  loadNotifications(): void {
    this.loading = true;
    this.notificationService.getNotifications(false, 10).subscribe({
      next: () => {
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  onNotificationClick(notification: INotification): void {
    // Marcar como leída
    if (!notification.read) {
      this.notificationService.markAsRead(notification._id).subscribe();
    }

    // Navegar a la acción
    this.router.navigateByUrl(notification.actionUrl);
    this.closeDropdown();
  }

  markAllAsRead(): void {
    this.notificationService.markAllAsRead().subscribe();
  }

  deleteNotification(event: Event, notification: INotification): void {
    event.stopPropagation();
    this.notificationService.deleteNotification(notification._id).subscribe();
  }

  getNotificationIcon(type: string): string {
    switch (type) {
      case 'chat_new':
        return 'chat_bubble';
      case 'chat_message':
        return 'message';
      case 'tirito_status':
        return 'info';
      case 'tirito_request':
        return 'person_add';
      case 'request_accepted':
        return 'check_circle';
      case 'request_rejected':
        return 'cancel';
      case 'rating_request':
        return 'star';
      case 'system':
        return 'campaign';
      default:
        return 'notifications';
    }
  }

  getNotificationColor(type: string): string {
    switch (type) {
      case 'chat_new':
        return 'primary';
      case 'chat_message':
        return 'accent';
      case 'tirito_request':
        return 'warn';
      case 'request_accepted':
        return 'primary';
      case 'request_rejected':
        return 'warn';
      case 'rating_request':
        return 'accent';
      default:
        return '';
    }
  }
}
