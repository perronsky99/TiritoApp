import { Component, OnInit } from '@angular/core';
import { NotificationService, INotification } from '../../../core/services/notification.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-notifications-list',
  templateUrl: './notifications-list.component.html',
  styleUrls: ['./notifications-list.component.scss']
})
export class NotificationsListComponent implements OnInit {
  notifications: INotification[] = [];
  loading = false;
  page = 1;
  limit = 20;
  total = 0;

  constructor(
    private notificationService: NotificationService,
    private router: Router
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
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  open(notification: INotification): void {
    if (!notification.read) {
      this.notificationService.markAsRead(notification._id).subscribe();
    }
    // Navegar a la acción especificada
    this.router.navigateByUrl(notification.actionUrl);
  }

  markAll(): void {
    this.notificationService.markAllAsRead().subscribe();
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
}
