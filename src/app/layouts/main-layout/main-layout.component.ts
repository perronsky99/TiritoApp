import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { FavoritesDrawerComponent } from '../favorites-drawer/favorites-drawer.component';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from '../../core/auth/auth.service';
import { ChatService } from '../../core/services/chat.service';
import { NotificationService } from '../../core/services/notification.service';
import { User } from '../../core/models/user.model';

/**
 * Layout principal de la aplicación
 * Contiene navbar y sidebar
 */
@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss']
})
export class MainLayoutComponent implements OnInit {
  isSidenavOpen = false;
  @ViewChild('favoritesSidenav') favoritesSidenav?: MatSidenav;
  @ViewChild('favoritesDrawer') favoritesDrawer?: FavoritesDrawerComponent;
  
  currentUser$: Observable<User | null>;
  unreadCount$: Observable<number>;
  notificationCount$: Observable<number>;

  constructor(
    public authService: AuthService,
    private chatService: ChatService,
    private notificationService: NotificationService,
    private router: Router
  ) {
    this.currentUser$ = this.authService.currentUser$;
    this.unreadCount$ = this.chatService.unreadCount$;
    this.notificationCount$ = this.notificationService.unreadCount$;
  }

  ngOnInit(): void {
    // Iniciar polling de notificaciones si el usuario está autenticado
    if (this.authService.isLoggedIn) {
      this.notificationService.startPolling();
    }
  }

  openFavorites(): void {
    // Close left sidenav if open
    this.closeSidenav();
    // open right drawer
    if (this.favoritesSidenav) {
      this.favoritesSidenav.open();
    }
  }

  onFavoritesOpened(): void {
    // ask drawer to reload current favorites
    try {
      this.favoritesDrawer?.loadFavorites();
    } catch (e) {
      // ignore
    }
  }

  toggleSidenav(): void {
    this.isSidenavOpen = !this.isSidenavOpen;
  }

  closeSidenav(): void {
    this.isSidenavOpen = false;
  }

  goToHome(): void {
    this.router.navigate(['/']);
    this.closeSidenav();
  }

  goToTiritos(): void {
    this.router.navigate(['/tiritos']);
    this.closeSidenav();
  }

  goToCreateTirito(): void {
    if (this.authService.isLoggedIn) {
      this.router.navigate(['/tiritos/nuevo']);
    } else {
      this.router.navigate(['/login'], {
        queryParams: { returnUrl: '/tiritos/nuevo' }
      });
    }
    this.closeSidenav();
  }

  goToChat(): void {
    this.router.navigate(['/chat']);
    this.closeSidenav();
  }

  goToRequests(): void {
    this.router.navigate(['/solicitudes']);
    this.closeSidenav();
  }

  goToProfile(): void {
    if (this.authService.currentUser) {
      this.router.navigate(['/perfil', this.authService.currentUser.id]);
    }
    this.closeSidenav();
  }

  goToNotifications(): void {
    this.router.navigate(['/notificaciones']);
    this.closeSidenav();
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
    this.closeSidenav();
  }

  logout(): void {
    this.notificationService.reset();
    this.authService.logout();
    this.closeSidenav();
    this.router.navigate(['/']);
  }
}
