import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProfileService } from '../../../core/services/profile.service';
import { TiritosService } from '../../../core/services/tiritos.service';
import { RatingService } from '../../../core/services/rating.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { RatingDialogComponent } from '../rating-dialog/rating-dialog.component';
import { AuthService } from '../../../core/auth/auth.service';
import { User, Tirito } from '../../../core/models';

/**
 * Vista de perfil público
 * Ruta: /perfil/:id
 * Requiere login
 */
@Component({
  selector: 'app-profile-view',
  templateUrl: './profile-view.component.html',
  styleUrls: ['./profile-view.component.scss']
})
export class ProfileViewComponent implements OnInit {
  user: User | null = null;
  tiritos: Tirito[] = [];
  loading = true;
  error: string | null = null;
  
  // Para tiritos del usuario
  loadingTiritos = false;
  // Ratings
  ratings: any[] = [];
  ratingSummary: { avgScore?: number; count?: number } = {};
  showRatingForm: { [tiritoId: string]: boolean } = {};
  ratingDrafts: { [tiritoId: string]: { score: number; comment: string; submitting?: boolean } } = {};
  // Ratings info por tirito (dado/recibido)
  tiritoRatings: { [tiritoId: string]: {
    givenRating: { score: number; comment?: string } | null;
    receivedRating: { score: number; comment?: string } | null;
    counterpartName: string | null;
    loading?: boolean;
    requestingRating?: boolean;
  } } = {};

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private profileService: ProfileService,
    private tiritosService: TiritosService,
    public authService: AuthService,
    private ratingService: RatingService,
    private snackBar: MatSnackBar
    ,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    const userId = this.route.snapshot.paramMap.get('id');
    if (userId) {
      this.loadProfile(userId);
    }
  }

  loadProfile(userId: string): void {
    this.loading = true;
    this.error = null;

    this.profileService.getProfile(userId).subscribe({
      next: (user) => {
        this.user = user;
        this.loading = false;
        this.loadUserTiritos();
        this.loadRatings(user.id);
      },
      error: (err) => {
        if (err.status === 404) {
          // Perfil no encontrado: intentar mostrar al menos los tiritos del creatorId
          this.error = 'Este usuario no existe';
          this.loading = false;
          // Intentar cargar tiritos publicados por este id para mostrar información parcial
          this.loadUserTiritosByCreator(userId);
        } else {
          this.error = 'No pudimos cargar el perfil';
          this.loading = false;
        }
      }
    });
  }

  loadUserTiritos(): void {
    if (!this.user) return;

    this.loadingTiritos = true;

    // Si es el propio perfil, usar el endpoint /me para obtener todos los tiritos (incluidos cerrados)
    if (this.isOwnProfile) {
      this.tiritosService.getMyTiritos().subscribe({
        next: (response) => {
          this.tiritos = response.data || [];
          this.loadingTiritos = false;
          this.tiritos.forEach(t => {
            this.ratingDrafts[t.id] = { score: 5, comment: '' };
            if (t.status === 'closed') {
              this.loadTiritoRatings(t.id);
            }
          });
        },
        error: () => this.loadingTiritos = false
      });
      return;
    }

    // Perfil público: obtener tiritos por creatorId (incluye cerrados)
    this.tiritosService.getTiritosByCreator(this.user.id, 1, 12).subscribe({
      next: (response) => {
        this.tiritos = response.data || [];
        this.loadingTiritos = false;
        this.tiritos.forEach(t => {
          this.ratingDrafts[t.id] = { score: 5, comment: '' };
          if (t.status === 'closed') {
            this.loadTiritoRatings(t.id);
          }
        });
      },
      error: () => this.loadingTiritos = false
    });
  }

  // Cargar info de ratings para un tirito específico
  loadTiritoRatings(tiritoId: string): void {
    this.tiritoRatings[tiritoId] = { givenRating: null, receivedRating: null, counterpartName: null, loading: true };
    this.ratingService.getRatingsForTirito(tiritoId).subscribe({
      next: (res) => {
        this.tiritoRatings[tiritoId] = {
          givenRating: res.givenRating,
          receivedRating: res.receivedRating,
          counterpartName: res.counterpartName,
          loading: false
        };
      },
      error: () => {
        this.tiritoRatings[tiritoId] = { givenRating: null, receivedRating: null, counterpartName: null, loading: false };
      }
    });
  }

  // Solicitar valoración a la contraparte
  requestRatingFromCounterpart(tiritoId: string): void {
    const info = this.tiritoRatings[tiritoId];
    if (!info) return;
    info.requestingRating = true;
    this.ratingService.requestRating(tiritoId).subscribe({
      next: () => {
        info.requestingRating = false;
        this.snackBar.open('Solicitud de valoración enviada', undefined, { duration: 3000 });
      },
      error: (err) => {
        info.requestingRating = false;
        const msg = err?.error?.message || 'No se pudo enviar la solicitud';
        this.snackBar.open(msg, undefined, { duration: 4000 });
      }
    });
  }

  // Cargar resumen y reseñas del usuario
  loadRatings(userId: string): void {
    this.ratingService.getSummary(userId).subscribe({
      next: (res: any) => this.ratingSummary = res,
      error: () => this.ratingSummary = {}
    });

    this.ratingService.getRatingsForUser(userId).subscribe({
      next: (res: any) => this.ratings = res.data || [],
      error: () => this.ratings = []
    });
  }

  canRateTirito(tirito: Tirito): boolean {
    const me = this.authService.currentUser;
    if (!me || !this.user) return false;
    if (tirito.status !== 'closed') return false;
    // Only participants can rate the other party
    const participated = me.id === tirito.creatorId || me.id === tirito.assignedTo;
    // Can't rate self
    if (me.id === this.user.id) return false;
    return participated;
  }

  toggleRatingForm(tirito: Tirito): void {
    this.showRatingForm[tirito.id] = !this.showRatingForm[tirito.id];
  }

  submitRating(tirito: Tirito): void {
    const draft = this.ratingDrafts[tirito.id];
    if (!draft || !this.user) return;
    draft.submitting = true;

    this.ratingService.createRating({
      tiritoId: tirito.id,
      targetId: this.user.id,
      score: draft.score,
      comment: draft.comment
    }).subscribe({
      next: () => {
        draft.submitting = false;
        this.showRatingForm[tirito.id] = false;
        this.snackBar.open('Valoración enviada', undefined, { duration: 3000 });
        // refresh summary and list
        if (this.user) this.loadRatings(this.user.id);
      },
      error: (err) => {
        draft.submitting = false;
        const msg = err?.error?.message || 'No se pudo enviar la valoración';
        this.snackBar.open(msg, undefined, { duration: 4000 });
      }
    });
  }

  openRatingDialog(tirito: Tirito): void {
    const dialogRef = this.dialog.open(RatingDialogComponent, {
      width: '520px',
      data: { tiritoId: tirito.id, targetId: this.user?.id, targetName: this.user?.name }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!result) return;
      const { score, comment } = result;
      // submit via ratingService
      this.ratingService.createRating({ tiritoId: tirito.id, targetId: this.user!.id, score, comment }).subscribe({
        next: () => {
          this.snackBar.open('Valoración enviada', undefined, { duration: 3000 });
          if (this.user) this.loadRatings(this.user.id);
        },
        error: (err) => {
          const msg = err?.error?.message || 'Error al enviar valoración';
          this.snackBar.open(msg, undefined, { duration: 4000 });
        }
      });
    });
  }

  // Intentar cargar tiritos usando un creatorId cuando el perfil no existe
  loadUserTiritosByCreator(creatorId: string): void {
    this.loadingTiritos = true;
    this.tiritosService.getTiritosByCreator(creatorId, 1, 12).subscribe({
      next: (response) => {
        const matches = response.data || [];
        this.tiritos = matches;
        // Si encontramos al menos un tirito, usar el creatorName del primero como nombre del perfil
        if (matches.length > 0) {
          this.user = {
            id: creatorId,
            name: matches[0].creatorName || 'Usuario',
            email: '',
            role: 'user',
            verificationStatus: 'unverified',
            createdAt: matches[0].createdAt,
            updatedAt: matches[0].createdAt
          } as any;
          this.error = null; // mostrar contenido parcial
          this.loadRatings(creatorId);
        }
        this.loadingTiritos = false;
      },
      error: () => {
        this.loadingTiritos = false;
      }
    });
  }

  get isOwnProfile(): boolean {
    return this.authService.currentUser?.id === this.user?.id;
  }

  getRoleLabel(role: string): string {
    switch (role) {
      case 'user':
        return 'Usuario';
      case 'worker':
        return 'Trabajador';
      case 'business':
        return 'Negocio';
      default:
        return role;
    }
  }

  goToTirito(tirito: Tirito): void {
    this.router.navigate(['/tiritos', tirito.id]);
  }

  goBack(): void {
    this.router.navigate(['/tiritos']);
  }
}
