import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { TiritosService } from '../../core/services/tiritos.service';
import { AuthService } from '../../core/auth/auth.service';
import { Tirito, TiritosResponse } from '../../core/models';

/**
 * Componente Home - Página principal
 * Ruta: /
 * Muestra tiritos destacados y CTA principal
 */
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  recentTiritos: Tirito[] = [];
  loading = true;
  error: string | null = null;

  constructor(
    private tiritosService: TiritosService,
    public authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadRecentTiritos();
  }

  loadRecentTiritos(): void {
    this.loading = true;
    this.error = null;

    this.tiritosService.getTiritos({ status: 'open', limit: 6 })
      .subscribe({
        next: (response) => {
          this.recentTiritos = response.data;
          this.loading = false;
        },
        error: (err) => {
          this.error = 'No pudimos cargar los tiritos';
          this.loading = false;
        }
      });
  }

  goToTiritos(): void {
    this.router.navigate(['/tiritos']);
  }

  goToCreateTirito(): void {
    if (this.authService.isLoggedIn) {
      this.router.navigate(['/tiritos/nuevo']);
    } else {
      this.router.navigate(['/login'], {
        queryParams: { returnUrl: '/tiritos/nuevo' }
      });
    }
  }

  goToTirito(tirito: Tirito): void {
    this.router.navigate(['/tiritos', tirito.id]);
  }
}
