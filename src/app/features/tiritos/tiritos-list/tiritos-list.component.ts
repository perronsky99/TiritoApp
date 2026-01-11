import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
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
  // page provided via route query param
  private routePage = 1;

  constructor(
    private tiritosService: TiritosService,
    public authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    // react to query params: `search` and `page`
    this.route.queryParamMap.subscribe(q => {
      const s = q.get('search') || '';
      const p = parseInt(q.get('page') || '1', 10) || 1;
      this.searchQuery = s;
      this.routePage = p;
      this.loadTiritos();
    });
  }

  loadTiritos(loadMore = false): void {
    if (loadMore) {
      this.loadingMore = true;
      this.page++;
    } else {
      this.loading = true;
      // use route-provided page when available (e.g. /tiritos?search=x&page=2)
      this.page = this.routePage || 1;
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
        // keep route page in sync when loading more
        if (loadMore) {
          this.router.navigate([], { relativeTo: this.route, queryParams: { page: this.page }, queryParamsHandling: 'merge' });
        }
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
    // update query params to reset page
    this.router.navigate([], { relativeTo: this.route, queryParams: { page: 1 }, queryParamsHandling: 'merge' });
    this.loadTiritos();
  }

  onSearch(): void {
    // navigate with search query so url reflects current search
    this.router.navigate([], { relativeTo: this.route, queryParams: { search: this.searchQuery || null, page: 1 }, queryParamsHandling: 'merge' });
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

  // Simple highlight helper used by template. Returns SafeHtml with <mark>
  highlight(text: string | undefined, term: string | undefined): SafeHtml {
    const t = text || '';
    const q = (term || '').trim();
    const escapeHtml = (s: string) => s.replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'} as any)[c]);
    const escapeRegExp = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    if (!q) return this.sanitizer.bypassSecurityTrustHtml(escapeHtml(t));
    const re = new RegExp(`(${escapeRegExp(q)})`, 'gi');
    const html = escapeHtml(t).replace(re, '<mark>$1</mark>');
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }
}
