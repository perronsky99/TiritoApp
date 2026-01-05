import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from '../../core/auth/auth.service';
import { ChatService } from '../../core/services/chat.service';
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
export class MainLayoutComponent {
  isSidenavOpen = false;
  
  currentUser$: Observable<User | null>;
  unreadCount$: Observable<number>;

  constructor(
    public authService: AuthService,
    private chatService: ChatService,
    private router: Router
  ) {
    this.currentUser$ = this.authService.currentUser$;
    this.unreadCount$ = this.chatService.unreadCount$;
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

  goToProfile(): void {
    if (this.authService.currentUser) {
      this.router.navigate(['/perfil', this.authService.currentUser.id]);
    }
    this.closeSidenav();
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
    this.closeSidenav();
  }

  logout(): void {
    this.authService.logout();
    this.closeSidenav();
  }
}
