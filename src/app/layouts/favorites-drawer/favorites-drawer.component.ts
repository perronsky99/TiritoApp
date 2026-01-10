import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { from, of } from 'rxjs';
import { catchError, filter, mergeMap, toArray } from 'rxjs/operators';
import { TiritosService } from '../../core/services/tiritos.service';

@Component({
  selector: 'app-favorites-drawer',
  templateUrl: './favorites-drawer.component.html',
  styleUrls: ['./favorites-drawer.component.scss']
})
export class FavoritesDrawerComponent implements OnInit {
  @Output() close = new EventEmitter<void>();
  loading = true;
  favorites: any[] = [];

  constructor(
    private tiritosService: TiritosService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadFavorites();
  }

  loadFavorites(): void {
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
}
