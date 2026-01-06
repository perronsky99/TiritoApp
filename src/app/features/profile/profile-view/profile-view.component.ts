import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProfileService } from '../../../core/services/profile.service';
import { TiritosService } from '../../../core/services/tiritos.service';
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

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private profileService: ProfileService,
    private tiritosService: TiritosService,
    public authService: AuthService
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
    
    // Por ahora cargamos tiritos del usuario actual si es su perfil
    // En producción, el backend filtraría por creatorId
    this.tiritosService.getTiritos({ limit: 6 }).subscribe({
      next: (response) => {
        // Filtrar solo los del usuario actual (temporal)
        this.tiritos = response.data.filter(t => t.creatorId === this.user?.id);
        this.loadingTiritos = false;
      },
      error: () => {
        this.loadingTiritos = false;
      }
    });
  }

  // Intentar cargar tiritos usando un creatorId cuando el perfil no existe
  loadUserTiritosByCreator(creatorId: string): void {
    this.loadingTiritos = true;
    this.tiritosService.getTiritos({ limit: 12 }).subscribe({
      next: (response) => {
        const matches = response.data.filter(t => t.creatorId === creatorId);
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
