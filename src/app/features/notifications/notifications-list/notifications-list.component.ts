import { Component, OnInit } from '@angular/core';
import { NotificationService, INotification } from '../../../core/services/notification.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-notifications-list',
  templateUrl: './notifications-list.component.html',
  styleUrls: ['./notifications-list.component.scss']
})
export class NotificationsListComponent implements OnInit {
  notifications: INotification[] = [];
  grouped: { label: string; items: INotification[] }[] = [];
  loading = false;
  page = 1;
  limit = 20;
  total = 0;

  constructor(
    private notificationService: NotificationService,
    private router: Router
    ,private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadPage(1);
  }

  loadPage(page: number): void {
    this.loading = true;
    const skip = (page - 1) * this.limit;
    this.notificationService.getNotifications(false, this.limit, skip).subscribe({
      next: (res) => {
        if (page === 1) {
          this.notifications = res.notifications;
        } else {
          this.notifications = [...this.notifications, ...res.notifications];
        }
        this.total = res.total;
        this.page = page;
        this.rebuildGroups();
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  open(notification: INotification): void {
    if (!notification.read) {
      this.notificationService.markAsRead(notification._id).subscribe(() => {
        this.snackBar.open('Notificación marcada como leída', 'Deshacer', { duration: 3000 })
          .onAction().subscribe(() => {
            // no implementamos deshacer en backend; simplemente volver a marcar como no leída localmente
            // (opcional: llamar endpoint para marcar como no leído si existe)
            const idx = this.notifications.findIndex(n => n._id === notification._id);
            if (idx >= 0) {
              this.notifications[idx].read = false;
              this.rebuildGroups();
            }
          });
        notification.read = true;
        this.rebuildGroups();
      });
    }
    // Navegar a la acción especificada
    this.router.navigateByUrl(notification.actionUrl);
  }

  markAll(): void {
    this.notificationService.markAllAsRead().subscribe(() => {
      this.snackBar.open('Todas las notificaciones marcadas como leídas', '', { duration: 2000 });
      this.notifications = this.notifications.map(n => ({ ...n, read: true }));
      this.rebuildGroups();
    });
  }

  delete(event: Event, n: INotification): void {
    event.stopPropagation();
    this.notificationService.deleteNotification(n._id).subscribe();
  }

  loadMore(): void {
    if (this.notifications.length < this.total) {
      this.loadPage(this.page + 1);
    }
  }

  private rebuildGroups(): void {
    // Ordenar: no leídas primero, luego por createdAt desc
    const sorted = [...this.notifications].sort((a, b) => {
      if (a.read === b.read) {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      return (a.read ? 1 : -1) - (b.read ? 1 : -1);
    });

    // Agrupar por etiqueta: Hoy / Ayer / Anteriores
    const groups: { label: string; items: INotification[] }[] = [];
    const today: INotification[] = [];
    const yesterday: INotification[] = [];
    const earlier: INotification[] = [];

    sorted.forEach(n => {
      const d = new Date(n.createdAt);
      if (this.isToday(d)) today.push(n);
      else if (this.isYesterday(d)) yesterday.push(n);
      else earlier.push(n);
    });

    if (today.length) groups.push({ label: 'Hoy', items: today });
    if (yesterday.length) groups.push({ label: 'Ayer', items: yesterday });
    if (earlier.length) groups.push({ label: 'Anteriores', items: earlier });

    this.grouped = groups;
  }

  private isToday(d: Date): boolean {
    const now = new Date();
    return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth() && d.getDate() === now.getDate();
  }

  private isYesterday(d: Date): boolean {
    const now = new Date();
    const y = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
    return d.getFullYear() === y.getFullYear() && d.getMonth() === y.getMonth() && d.getDate() === y.getDate();
  }
}
