import { Component, EventEmitter, OnInit, Output, AfterViewInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { from, of } from 'rxjs';
import { catchError, filter, mergeMap, toArray } from 'rxjs/operators';
import { TiritosService } from '../../core/services/tiritos.service';
import { FavoritesService } from '../../core/services/favorites.service';
import { AuthService } from '../../core/auth/auth.service';
import { FavoritesStateService } from '../../core/services/favorites-state.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-favorites-drawer',
  templateUrl: './favorites-drawer.component.html',
  styleUrls: ['./favorites-drawer.component.scss']
})
export class FavoritesDrawerComponent implements OnInit {
  @Output() close = new EventEmitter<void>();
  loading = true;
  favorites: any[] = [];
  // pagination for server-backed favorites
  page = 1;
  limit = 12;
  hasMore = false;
  private observer?: IntersectionObserver;
  @ViewChild('sentinel') sentinel?: ElementRef<HTMLElement>;

  constructor(
    private tiritosService: TiritosService,
    private router: Router,
    private snackBar: MatSnackBar,
    private favoritesService: FavoritesService,
    private authService: AuthService,
    private favoritesState: FavoritesStateService
  ) {}

  ngOnInit(): void {
    this.loadFavorites();
    // subscribe to external changes (add/remove) to refresh
    this._sub = this.favoritesState.onChange().subscribe(() => {
      this.page = 1;
      this.favorites = [];
      this.loadFavoritesFromServer();
    });
  }

  ngAfterViewInit(): void {
    // setup intersection observer for infinite scroll
    try {
      this.observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting && this.hasMore && !this.loading) {
            this.loadMore();
          }
        });
      }, { root: null, rootMargin: '200px', threshold: 0.1 });

      if (this.sentinel && this.sentinel.nativeElement) {
        this.observer.observe(this.sentinel.nativeElement);
      }
    } catch (e) {
      // IntersectionObserver not supported — fallback: no-op, user can use 'Ver más' fallback if implemented
    }
  }

  ngOnDestroy(): void {
    if (this.observer && this.sentinel && this.sentinel.nativeElement) {
      this.observer.unobserve(this.sentinel.nativeElement);
    }
    this.observer = undefined;
    if (this._sub) this._sub.unsubscribe();
  }

  private _sub?: Subscription;

  loadFavorites(): void {
    // If user is authenticated, load from server (paginated)
    if (this.authService.isLoggedIn) {
      this.page = 1;
      this.favorites = [];
      this.loadFavoritesFromServer();
      return;
    }

    const raw = localStorage.getItem('tirito_favorites') || '[]';
    let ids: string[] = [];
    try {
      ids = JSON.parse(raw) as string[];
    } catch (e) {
      ids = [];
    }

    if (!ids || ids.length === 0) {
      this.favorites = [];
      this.loading = false;
      return;
    }

    // Cargar detalles con concurrencia limitada para cuidar performance
    from(ids).pipe(
      mergeMap(id => this.tiritosService.getTiritoById(id).pipe(
        catchError(() => of(null))
      ), 4),
      filter(x => !!x),
      toArray()
    ).subscribe(results => {
      this.favorites = results as any[];
      this.loading = false;
    }, () => {
      this.loading = false;
      this.favorites = [];
    });
  }

  private loadFavoritesFromServer(): void {
    this.loading = true;
    this.favoritesService.getFavorites(this.page, this.limit).subscribe({
      next: (res) => {
        // backend may return { favorites: [...], total, page }
        const items = res.favorites || res.items || [];
        this.favorites = this.favorites.concat(items);
        const total = res.total || items.length;
        this.hasMore = (this.favorites.length < total);
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.favorites = [];
      }
    });
  }

  openTirito(tiritoId: string): void {
    // If caller passed a route-like string (e.g. '/tiritos'), detect and navigate
    if (tiritoId && tiritoId.startsWith('/')) {
      this.router.navigate([tiritoId]);
      return;
    }
    this.router.navigate(['/tiritos', tiritoId]);
  }

  explore(): void {
    this.router.navigate(['/tiritos']);
  }

  removeFavorite(tiritoId: string, event?: Event): void {
    if (event) event.stopPropagation();
    if (this.authService.isLoggedIn) {
      this.favoritesService.removeFavorite(tiritoId).subscribe({
        next: () => {
          this.favorites = this.favorites.filter(f => f.id !== tiritoId);
          this.snackBar.open('Quitado de Favoritos', undefined, { duration: 1400 });
        },
        error: () => {
          this.snackBar.open('No se pudo quitar de favoritos', undefined, { duration: 2000 });
        }
      });
      return;
    }

    const raw = localStorage.getItem('tirito_favorites') || '[]';
    let ids: string[] = [];
    try { ids = JSON.parse(raw) as string[]; } catch (e) { ids = []; }
    const filtered = ids.filter(id => id !== tiritoId);
    localStorage.setItem('tirito_favorites', JSON.stringify(filtered));
    this.favorites = this.favorites.filter(f => f.id !== tiritoId);
    this.snackBar.open('Quitado de Favoritos', undefined, { duration: 1400 });
  }

  closeDrawer(): void {
    this.close.emit();
  }

  loadMore(): void {
    if (this.loading || !this.hasMore) return;
    this.page++;
    this.loadFavoritesFromServer();
  }
}
