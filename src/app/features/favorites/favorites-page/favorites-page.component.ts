import { Component, OnInit } from '@angular/core';
import { FavoritesService } from '../../../core/services/favorites.service';
import { TiritosService } from '../../../core/services/tiritos.service';

@Component({
  selector: 'app-favorites-page',
  templateUrl: './favorites-page.component.html',
  styleUrls: ['./favorites-page.component.scss']
})
export class FavoritesPageComponent implements OnInit {
  loading = true;
  favorites: any[] = [];
  error: string | null = null;

  page = 1;
  limit = 12;
  hasMore = false;

  constructor(
    private favService: FavoritesService,
    private tiritosService: TiritosService
  ) {}

  ngOnInit(): void {
    this.loadPage();
  }

  loadPage(): void {
    this.loading = true;
    this.favService.getFavorites(this.page, this.limit).subscribe({
      next: (res) => {
        const items = res.favorites || res.items || [];
        this.favorites = this.favorites.concat(items);
        const total = res.total || items.length;
        this.hasMore = (this.favorites.length < total);
        this.loading = false;
      },
      error: () => {
        this.error = 'No se pudieron cargar favoritos';
        this.loading = false;
      }
    });
  }

  loadMore(): void {
    if (this.loading || !this.hasMore) return;
    this.page++;
    this.loadPage();
  }
}
