import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthService } from '../../../core/auth/auth.service';
import { ESTADOS_VENEZUELA, TIPOS_DOCUMENTO, getMunicipiosByEstado, Municipio } from '../../../shared/data/venezuela-locations';

/**
 * Componente de Login
 * Ruta: /login
 */
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  loginForm: FormGroup;
  registerForm: FormGroup;
  
  isLoginMode = true;
  loading = false;
  hidePassword = true;
  
  // Datos de Venezuela
  estados = ESTADOS_VENEZUELA;
  tiposDocumento = TIPOS_DOCUMENTO;
  municipios: Municipio[] = [];
  
  // Fecha máxima (debe ser mayor de 18 años)
  maxDate = new Date();
  
  private returnUrl: string;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {
    // Calcular fecha máxima (18 años atrás)
    this.maxDate.setFullYear(this.maxDate.getFullYear() - 18);
    
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });

    this.registerForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      documentType: ['V', Validators.required],
      documentNumber: ['', [Validators.required, Validators.pattern(/^\d{6,10}$/)]],
      birthDate: ['', Validators.required],
      estado: ['', Validators.required],
      municipio: ['', Validators.required],
      direccion: ['', [Validators.required, Validators.minLength(10)]],
      phoneMobile: ['', [Validators.required, Validators.pattern(/^(0414|0424|0412|0416|0426)\d{7}$/)]],
      phoneLocal: ['', [Validators.pattern(/^(0\d{3})\d{7}$/)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      role: ['user', Validators.required]
    });

    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  ngOnInit(): void {
    // Si ya está logueado, redirigir
    if (this.authService.isLoggedIn) {
      this.router.navigate([this.returnUrl]);
    }
    
    // Escuchar cambios en el estado para cargar municipios
    this.registerForm.get('estado')?.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(estadoId => {
      this.municipios = getMunicipiosByEstado(estadoId);
      this.registerForm.get('municipio')?.setValue('');
    });
  }

  toggleMode(): void {
    this.isLoginMode = !this.isLoginMode;
  }

  onLogin(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    
    this.authService.login(this.loginForm.value).subscribe({
      next: () => {
        this.router.navigate([this.returnUrl]);
      },
      error: (error) => {
        this.loading = false;
        this.snackBar.open(
          error.error?.message || 'Error al iniciar sesión',
          'Cerrar',
          { duration: 5000 }
        );
      }
    });
  }

  onRegister(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    
    this.authService.register(this.registerForm.value).subscribe({
      next: () => {
        this.snackBar.open('¡Cuenta creada exitosamente!', 'Cerrar', {
          duration: 3000
        });
        this.router.navigate([this.returnUrl]);
      },
      error: (error) => {
        this.loading = false;
        this.snackBar.open(
          error.error?.message || 'Error al crear cuenta',
          'Cerrar',
          { duration: 5000 }
        );
      }
    });
  }

  // Getters para validación en template - Login
  get loginEmail() { return this.loginForm.get('email'); }
  get loginPassword() { return this.loginForm.get('password'); }
  
  // Getters para validación en template - Registro
  get registerFirstName() { return this.registerForm.get('firstName'); }
  get registerLastName() { return this.registerForm.get('lastName'); }
  get registerDocumentType() { return this.registerForm.get('documentType'); }
  get registerDocumentNumber() { return this.registerForm.get('documentNumber'); }
  get registerBirthDate() { return this.registerForm.get('birthDate'); }
  get registerEstado() { return this.registerForm.get('estado'); }
  get registerMunicipio() { return this.registerForm.get('municipio'); }
  get registerDireccion() { return this.registerForm.get('direccion'); }
  get registerPhoneMobile() { return this.registerForm.get('phoneMobile'); }
  get registerPhoneLocal() { return this.registerForm.get('phoneLocal'); }
  get registerEmail() { return this.registerForm.get('email'); }
  get registerPassword() { return this.registerForm.get('password'); }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
