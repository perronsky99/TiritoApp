import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { TiritosService } from '../../../core/services/tiritos.service';
import { ChatService, IChat } from '../../../core/services/chat.service';
import { AuthService } from '../../../core/auth/auth.service';
import { AnalyticsService } from '../../../core/services/analytics.service';
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
export class TiritoDetailComponent implements OnInit {
  tirito: Tirito | null = null;
  loading = true;
  error: string | null = null;
  
  // Para acciones del owner
  actionLoading = false;
  
  // Galería de imágenes
  selectedImageIndex = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private tiritosService: TiritosService,
    private chatService: ChatService,
    public authService: AuthService,
    private analyticsService: AnalyticsService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadTirito(id);
    }
  }

  loadTirito(id: string): void {
    this.loading = true;
    this.error = null;

    this.tiritosService.getTiritoById(id).subscribe({
      next: (tirito) => {
        this.tirito = tirito;
        this.loading = false;
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
   * Verifica si el usuario actual es el creador
   */
  get isOwner(): boolean {
    return this.authService.currentUser?.id === this.tirito?.creatorId;
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

    // Enviar primer mensaje - el backend crea el chat automáticamente
    const initialMessage = `Hola! Me interesa tu tirito "${this.tirito.title}"`;
    
    this.chatService.sendMessage(this.tirito.id, initialMessage).subscribe({
      next: (response) => {
        // Backend devuelve { message: string, data: IMessage } donde data.chatId tiene el ID del chat
        this.analyticsService.trackChatStarted(response.data.chatId, this.tirito!.id);
        this.analyticsService.trackContactInitiated(this.tirito!.id);
        // Navegar al chat usando el tiritoId
        this.router.navigate(['/chat', this.tirito!.id]);
      },
      error: () => {
        this.snackBar.open('No pudimos iniciar el chat', 'Cerrar', {
          duration: 3000
        });
      }
    });
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

  selectImage(index: number): void {
    this.selectedImageIndex = index;
  }

  goToProfile(): void {
    if (this.tirito) {
      this.router.navigate(['/perfil', this.tirito.creatorId]);
    }
  }

  goBack(): void {
    this.router.navigate(['/tiritos']);
  }
}
