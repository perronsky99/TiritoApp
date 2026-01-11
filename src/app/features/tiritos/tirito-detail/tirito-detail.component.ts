import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild, ElementRef, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { RatingDialogComponent } from '../../profile/rating-dialog/rating-dialog.component';
import { RatingService } from '../../../core/services/rating.service';
import { TiritosService } from '../../../core/services/tiritos.service';
import { TiritoRequestsService } from '../../../core/services/tirito-requests.service';
import { ChatService, IChat } from '../../../core/services/chat.service';
import { AuthService } from '../../../core/auth/auth.service';
import { FavoritesService } from '../../../core/services/favorites.service';
import { FavoritesStateService } from '../../../core/services/favorites-state.service';
import { Subscription } from 'rxjs';
import { AnalyticsService } from '../../../core/services/analytics.service';
import { NotificationService } from '../../../core/services/notification.service';
import { Tirito } from '../../../core/models';

/**
 * Detalle de un Tirito
 * Ruta: /tiritos/:id
 * Pública - Cualquiera puede ver
 */
@Component({
  selector: 'app-tirito-detail',
  templateUrl: './tirito-detail.component.html',
  styleUrls: ['./tirito-detail.component.scss']
})
export class TiritoDetailComponent implements OnInit, OnDestroy {
  private _favSub?: Subscription;
  tirito: Tirito | null = null;
  loading = true;
  error: string | null = null;
  
  // Para acciones del owner
  actionLoading = false;
  
  // Estado de la solicitud del usuario actual
  myRequest: { id: string; status: string; createdAt: string } | null = null;
  
  // Galería de imágenes
  selectedImageIndex = 0;
  // Helper para la lista de imágenes segura
  get images(): any[] {
    return (this.tirito && Array.isArray(this.tirito.images)) ? this.tirito.images : [];
  }

  // Favoritos locales (persistidos en localStorage)
  private favorites: Set<string> = new Set<string>();

  // Depuración: mostrar objeto tirito en JSON
  showRaw = false;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private tiritosService: TiritosService,
    private tiritoRequestsService: TiritoRequestsService,
    private chatService: ChatService,
    public authService: AuthService,
    private analyticsService: AnalyticsService,
    private notificationService: NotificationService,
    private snackBar: MatSnackBar
    ,
    private dialog: MatDialog,
    private ratingService: RatingService,
    private favoritesService: FavoritesService,
    private favoritesState: FavoritesStateService
  ) {}

  @ViewChild('mainImage', { static: false }) private _mainImage?: ElementRef<HTMLElement>;
  @ViewChild('rightCol', { static: false }) private _rightCol?: ElementRef<HTMLElement>;

  ngAfterViewInit(): void {
    // sync heights after view is ready
    setTimeout(() => this.syncPanelHeight(), 120);
  }

  @HostListener('window:resize')
  onWindowResize(): void {
    // small debounce
    if ((this as any)._resizeTimer) clearTimeout((this as any)._resizeTimer);
    (this as any)._resizeTimer = setTimeout(() => this.syncPanelHeight(), 120);
  }

  private syncPanelHeight(): void {
    try {
      const imgEl = this._mainImage?.nativeElement as HTMLElement | undefined;
      const panelEl = this._rightCol?.nativeElement as HTMLElement | undefined;
      if (!imgEl || !panelEl) return;
      const h = imgEl.getBoundingClientRect().height;
      // ensure the panel is at least the image height minus some padding
      panelEl.style.height = `${Math.max(h, 260)}px`;
    } catch (e) {
      // ignore
    }
  }

  ngOnInit(): void {
    this.loadFavorites();
    // update local favorites when other components change favorites
    try {
      this._favSub = this.favoritesState.onChange().subscribe(() => {
        this.loadFavorites();
      });
    } catch (e) {}
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadTirito(id);
    }
  }

  private loadFavorites(): void {
    try {
      // If logged in, try to load from server into local cache
      if (this.authService.isLoggedIn) {
        this.favoritesService.getFavorites(1, 1000).subscribe({
          next: (res) => {
            const ids = (res.favorites || res.items || []).map((f: any) => f._id || f.id || f);
            this.favorites = new Set(ids);
            this.saveFavorites();
          },
          error: () => {
            // Fallback to localStorage
            const raw = localStorage.getItem('tirito_favorites');
            if (raw) {
              const arr = JSON.parse(raw) as string[];
              this.favorites = new Set(arr);
            }
          }
        });
        return;
      }

      const raw = localStorage.getItem('tirito_favorites');
      if (raw) {
        const arr = JSON.parse(raw) as string[];
        this.favorites = new Set(arr);
      }
    } catch (e) {
      this.favorites = new Set<string>();
    }
  }

  private saveFavorites(): void {
    try {
      localStorage.setItem('tirito_favorites', JSON.stringify(Array.from(this.favorites)));
    } catch (e) {
      // ignore
    }
  }

  isFavorited(id?: string | null): boolean {
    if (!id) return false;
    return this.favorites.has(id);
  }

  toggleFavorite(event: Event): void {
    event.stopPropagation();
    if (!this.tirito || !this.tirito.id) return;
    const id = this.tirito.id;
    // If user is logged in, sync with backend; otherwise persist locally
    if (this.authService.isLoggedIn) {
      if (this.favorites.has(id)) {
        this.favoritesService.removeFavorite(id).subscribe({
          next: () => {
            this.favorites.delete(id);
            this.snackBar.open('Quitado de favoritos', undefined, { duration: 1500 });
            this.saveFavorites();
            try { this.favoritesState.notifyChange(); } catch (e) {}
          },
          error: () => {
            this.snackBar.open('No se pudo quitar de favoritos', undefined, { duration: 2000 });
          }
        });
      } else {
        this.favoritesService.addFavorite(id).subscribe({
          next: () => {
            this.favorites.add(id);
            this.snackBar.open('Agregado a favoritos', undefined, { duration: 1500 });
            this.saveFavorites();
            try { this.favoritesState.notifyChange(); } catch (e) {}
          },
          error: () => {
            this.snackBar.open('No se pudo agregar a favoritos', undefined, { duration: 2000 });
          }
        });
      }
      return;
    }

    if (this.favorites.has(id)) {
      this.favorites.delete(id);
      this.snackBar.open('Quitado de favoritos', undefined, { duration: 1500 });
    } else {
      this.favorites.add(id);
      this.snackBar.open('Agregado a favoritos', undefined, { duration: 1500 });
    }
    this.saveFavorites();
  }

  ngOnDestroy(): void {
    if (this._favSub) this._favSub.unsubscribe();
  }

  canRate(): boolean {
    const me = this.authService.currentUser;
    if (!me || !this.tirito) return false;
    if (this.tirito.status !== 'closed') return false;
    const isParticipant = me.id === this.tirito.creatorId || me.id === this.tirito.assignedTo;
    return isParticipant;
  }

  openRating(): void {
    if (!this.tirito || !this.authService.currentUser) return;

    // determine target: if current user is creator, target is assignedTo; else target is creator
    const me = this.authService.currentUser;
    let targetId = '';
    let targetName = '';
    if (me.id === this.tirito.creatorId) {
      targetId = this.tirito.assignedTo as any;
      targetName = (this.tirito as any).assignedToName || 'Usuario';
    } else {
      targetId = this.tirito.creatorId;
      targetName = this.tirito.creatorName || 'Usuario';
    }

    if (!targetId || targetId === me.id) return; // safety

    const dialogRef = this.dialog.open(RatingDialogComponent, {
      width: '520px',
      data: { tiritoId: this.tirito.id, targetId, targetName }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!result) return;
      const { score, comment } = result;
      this.ratingService.createRating({ tiritoId: this.tirito!.id, targetId, score, comment }).subscribe({
        next: () => {
          this.snackBar.open('Valoración enviada', undefined, { duration: 3000 });
        },
        error: (err) => {
          const msg = err?.error?.message || 'No se pudo enviar la valoración';
          this.snackBar.open(msg, undefined, { duration: 4000 });
        }
      });
    });
  }

  loadTirito(id: string): void {
    this.loading = true;
    this.error = null;

    this.tiritosService.getTiritoById(id).subscribe({
      next: (tirito) => {
        this.tirito = tirito;
        this.loading = false;
        
        // Si el usuario está logueado y no es el owner, verificar si ya tiene una solicitud
        if (this.authService.isLoggedIn && tirito.creatorId !== this.authService.currentUser?.id) {
          this.loadMyRequest(id);
        }
      },
      error: (err) => {
        if (err.status === 404) {
          this.error = 'Este tirito no existe';
        } else {
          this.error = 'No pudimos cargar el tirito';
        }
        this.loading = false;
      }
    });
  }

  /**
   * Carga la solicitud del usuario actual para este tirito (si existe)
   */
  loadMyRequest(tiritoId: string): void {
    this.tiritoRequestsService.getMyRequestForTirito(tiritoId).subscribe({
      next: (res) => {
        this.myRequest = res.request;
      },
      error: () => {
        // Ignorar errores - simplemente no mostramos estado de solicitud
      }
    });
  }

  /**
   * Verifica si el usuario actual es el creador
   */
  get isOwner(): boolean {
    return this.authService.currentUser?.id === this.tirito?.creatorId;
  }

  /**
   * Verifica si el usuario actual es el worker asignado
   */
  get isAssignedWorker(): boolean {
    return this.authService.currentUser?.id === this.tirito?.assignedTo;
  }

  /**
   * Inicia contacto con el creador del tirito
   * Backend v1.0: Enviar mensaje crea el chat automáticamente
   */
  contact(): void {
    if (!this.authService.isLoggedIn) {
      this.router.navigate(['/login'], {
        queryParams: { returnUrl: `/tiritos/${this.tirito?.id}` }
      });
      return;
    }

    if (!this.tirito) return;

    // Navegar directamente al chat - el usuario puede escribir ahí
    this.router.navigate(['/chat', this.tirito.id]);
  }

  /**
   * Marca el tirito como "en progreso"
   */
  markInProgress(): void {
    if (!this.tirito) return;

    this.actionLoading = true;

    this.tiritosService.markInProgress(this.tirito.id).subscribe({
      next: (updated) => {
        this.tirito = updated;
        this.actionLoading = false;
        this.snackBar.open('Tirito marcado en progreso', 'Cerrar', {
          duration: 3000
        });
      },
      error: (err) => {
        this.actionLoading = false;
        this.snackBar.open(
          err.error?.message || 'No pudimos actualizar el tirito',
          'Cerrar',
          { duration: 3000 }
        );
      }
    });
  }

  /**
   * Cierra el tirito
   */
  closeTirito(): void {
    if (!this.tirito) return;

    this.actionLoading = true;

    this.tiritosService.closeTirito(this.tirito.id).subscribe({
      next: (updated) => {
        this.tirito = updated;
        this.actionLoading = false;
        this.analyticsService.trackTiritoClosed(this.tirito!.id);
        this.snackBar.open('¡Tirito cerrado exitosamente!', 'Cerrar', {
          duration: 3000
        });
      },
      error: (err) => {
        this.actionLoading = false;
        this.snackBar.open(
          err.error?.message || 'No pudimos cerrar el tirito',
          'Cerrar',
          { duration: 3000 }
        );
      }
    });
  }

  /**
   * Usuario solicita tomar el trabajo del tirito
   * Envía una solicitud que el creador debe aprobar
   */
  acceptTirito(): void {
    if (!this.tirito || !this.authService.isLoggedIn) return;

    this.actionLoading = true;

    this.tiritoRequestsService.createRequest(this.tirito.id, '¡Me interesa hacer este tirito!').subscribe({
      next: (res) => {
        this.actionLoading = false;
        // Actualizar el estado local para reflejar la solicitud enviada
        this.myRequest = {
          id: res.request.id,
          status: 'pending',
          createdAt: res.request.createdAt || new Date().toISOString()
        };
        this.snackBar.open('¡Solicitud enviada! El creador revisará tu perfil y decidirá.', 'Cerrar', {
          duration: 5000
        });
      },
      error: (err) => {
        this.actionLoading = false;
        this.snackBar.open(
          err.error?.message || 'No pudimos enviar la solicitud',
          'Cerrar',
          { duration: 3000 }
        );
      }
    });
  }

  selectImage(index: number): void {
    this.selectedImageIndex = index;
  }

  toggleRaw(): void {
    this.showRaw = !this.showRaw;
  }

  goToProfile(): void {
    if (this.tirito?.creatorId) {
      this.router.navigate(['/perfil', this.tirito.creatorId]);
    }
  }

  goBack(): void {
    this.router.navigate(['/tiritos']);
  }

  shareTirito(event: Event): void {
    event.stopPropagation();
    const url = `${location.origin}/tiritos/${this.tirito?.id}`;
    try {
      navigator.clipboard?.writeText(url);
      this.snackBar.open('Enlace copiado al portapapeles', undefined, { duration: 1500 });
    } catch (e) {
      // fallback: open native prompt
      window.prompt('Copia el enlace', url);
    }
  }

  openImageInNewTab(index = 0): void {
    const img = this.images[index];
    const src = img?.url || img?.thumbnailUrl || img;
    if (src) window.open(src, '_blank');
  }
}
