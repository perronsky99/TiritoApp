import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { RatingDialogComponent } from '../../profile/rating-dialog/rating-dialog.component';
import { RatingService } from '../../../core/services/rating.service';
import { TiritosService } from '../../../core/services/tiritos.service';
import { TiritoRequestsService } from '../../../core/services/tirito-requests.service';
import { ChatService, IChat } from '../../../core/services/chat.service';
import { AuthService } from '../../../core/auth/auth.service';
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
    private tiritoRequestsService: TiritoRequestsService,
    private chatService: ChatService,
    public authService: AuthService,
    private analyticsService: AnalyticsService,
    private notificationService: NotificationService,
    private snackBar: MatSnackBar
    ,
    private dialog: MatDialog,
    private ratingService: RatingService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadTirito(id);
    }
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
        // Backend devuelve { message: string, data: IMessage, isNewChat: boolean }
        this.analyticsService.trackChatStarted(response.data.chatId, this.tirito!.id);
        this.analyticsService.trackContactInitiated(this.tirito!.id);
        
        // Mostrar toast de confirmación
        this.snackBar.open('¡Mensaje enviado! El dueño del tirito recibirá una notificación.', 'Ver chat', {
          duration: 5000,
          panelClass: ['success-snackbar']
        }).onAction().subscribe(() => {
          this.router.navigate(['/chat', this.tirito!.id]);
        });

        // Refrescar contador de notificaciones (por si el usuario también tiene notificaciones)
        this.notificationService.refreshUnreadCount();
        
        // Navegar al chat usando el tiritoId
        this.router.navigate(['/chat', this.tirito!.id]);
      },
      error: () => {
        this.snackBar.open('No pudimos iniciar el chat', 'Cerrar', {
          duration: 3000,
          panelClass: ['error-snackbar']
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

  /**
   * Usuario solicita tomar el trabajo del tirito
   * Envía una solicitud que el creador debe aprobar
   */
  acceptTirito(): void {
    if (!this.tirito || !this.authService.isLoggedIn) return;

    this.actionLoading = true;

    this.tiritoRequestsService.createRequest(this.tirito.id, '¡Me interesa hacer este tirito!').subscribe({
      next: () => {
        this.actionLoading = false;
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

  goToProfile(): void {
    if (this.tirito?.creatorId) {
      this.router.navigate(['/perfil', this.tirito.creatorId]);
    }
  }

  goBack(): void {
    this.router.navigate(['/tiritos']);
  }
}
