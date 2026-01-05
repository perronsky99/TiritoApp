import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TiritosService } from '../../../core/services/tiritos.service';
import { AuthService } from '../../../core/auth/auth.service';
import { Tirito, TiritoStatus, TiritoFilters } from '../../../core/models';

/**
 * Lista de Tiritos
 * Ruta: /tiritos
 * Pública - Muestra todos los tiritos con filtros
 */
@Component({
  selector: 'app-tiritos-list',
  templateUrl: './tiritos-list.component.html',
  styleUrls: ['./tiritos-list.component.scss']
})
export class TiritosListComponent implements OnInit {
  tiritos: Tirito[] = [];
  loading = true;
  error: string | null = null;
  
  // Filtros
  currentStatus: TiritoStatus | 'all' = 'open';
  searchQuery = '';
  
  // Paginación
  page = 1;
  hasMore = false;
  loadingMore = false;

  constructor(
    private tiritosService: TiritosService,
    public authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadTiritos();
  }

  loadTiritos(loadMore = false): void {
    if (loadMore) {
      this.loadingMore = true;
      this.page++;
    } else {
      this.loading = true;
      this.page = 1;
      this.tiritos = [];
    }
    
    this.error = null;

    const filters: TiritoFilters = {
      page: this.page,
      limit: 12
    };

    if (this.currentStatus !== 'all') {
      filters.status = this.currentStatus;
    }

    if (this.searchQuery.trim()) {
      filters.search = this.searchQuery.trim();
    }

    this.tiritosService.getTiritos(filters).subscribe({
      next: (response) => {
        if (loadMore) {
          this.tiritos = [...this.tiritos, ...response.data];
        } else {
          this.tiritos = response.data;
        }
        this.hasMore = response.hasMore;
        this.loading = false;
        this.loadingMore = false;
      },
      error: () => {
        this.error = 'No pudimos cargar los tiritos';
        this.loading = false;
        this.loadingMore = false;
      }
    });
  }

  onFilterChange(status: TiritoStatus | 'all'): void {
    this.currentStatus = status;
    this.loadTiritos();
  }

  onSearch(): void {
    this.loadTiritos();
  }

  goToTirito(tirito: Tirito): void {
    this.router.navigate(['/tiritos', tirito.id]);
  }

  goToCreate(): void {
    if (this.authService.isLoggedIn) {
      this.router.navigate(['/tiritos/nuevo']);
    } else {
      this.router.navigate(['/login'], {
        queryParams: { returnUrl: '/tiritos/nuevo' }
      });
    }
  }

  loadMore(): void {
    if (this.hasMore && !this.loadingMore) {
      this.loadTiritos(true);
    }
  }
}
