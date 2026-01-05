import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TiritosService } from '../../../core/services/tiritos.service';
import { AnalyticsService } from '../../../core/services/analytics.service';

/**
 * Crear nuevo Tirito
 * Ruta: /tiritos/nuevo
 * Requiere login
 */
@Component({
  selector: 'app-tirito-create',
  templateUrl: './tirito-create.component.html',
  styleUrls: ['./tirito-create.component.scss']
})
export class TiritoCreateComponent implements OnInit {
  form: FormGroup;
  images: File[] = [];
  loading = false;
  
  // Para verificar si puede crear
  canCreate = true;
  cantCreateMessage = '';
  checkingLimit = true;

  constructor(
    private fb: FormBuilder,
    private tiritosService: TiritosService,
    private analyticsService: AnalyticsService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.form = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.minLength(20), Validators.maxLength(1000)]],
      location: ['']
    });
  }

  ngOnInit(): void {
    this.checkCanCreate();
  }

  /**
   * Verifica si el usuario puede crear un nuevo tirito
   * Límite: 1 tirito activo por usuario
   */
  checkCanCreate(): void {
    this.checkingLimit = true;
    
    this.tiritosService.canCreateTirito().subscribe({
      next: (result) => {
        this.canCreate = result.canCreate;
        this.cantCreateMessage = result.message || 
          'Ya tenés un tirito activo. Cerralo para publicar uno nuevo.';
        this.checkingLimit = false;
      },
      error: () => {
        // En caso de error, permitir crear (el backend validará)
        this.canCreate = true;
        this.checkingLimit = false;
      }
    });
  }

  onImagesChange(images: File[]): void {
    this.images = images;
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    if (!this.canCreate) {
      this.snackBar.open(this.cantCreateMessage, 'Cerrar', {
        duration: 5000
      });
      return;
    }

    this.loading = true;

    this.tiritosService.createTirito({
      title: this.form.value.title,
      description: this.form.value.description,
      location: this.form.value.location || undefined,
      images: this.images.length > 0 ? this.images : undefined
    }).subscribe({
      next: (tirito) => {
        this.analyticsService.trackTiritoCreated(tirito.id);
        this.snackBar.open('¡Tirito publicado!', 'Ver', {
          duration: 5000
        }).onAction().subscribe(() => {
          this.router.navigate(['/tiritos', tirito.id]);
        });
        this.router.navigate(['/tiritos', tirito.id]);
      },
      error: (err) => {
        this.loading = false;
        const message = err.error?.message || 'No pudimos publicar tu tirito';
        this.snackBar.open(message, 'Cerrar', {
          duration: 5000
        });
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/tiritos']);
  }

  // Getters para validación
  get title() { return this.form.get('title'); }
  get description() { return this.form.get('description'); }
}
