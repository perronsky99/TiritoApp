import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { CedulaLookupService, CedulaResult } from '../../../core/services/cedula-lookup.service';
import { ESTADOS_VENEZUELA } from '../../../shared/data/venezuela-locations';
import { AuthService } from '../../../core/services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register-stepper',
  templateUrl: './register-stepper.component.html',
  styleUrls: ['./register-stepper.component.scss']
})
export class RegisterStepperComponent implements OnInit {
  @ViewChild('stepper') stepper!: MatStepper;

  stepDocForm!: FormGroup;
  personalForm!: FormGroup;
  addressForm!: FormGroup;
  contactForm!: FormGroup;
  verificacionForm!: FormGroup;

  lookupInProgress = false;
  lookupResult: CedulaResult | null = null;
  lookupError: string | null = null; // descriptive message
  isSubmitting = false;
  // Store raw numeric document number (no thousands separators) when formatting is applied
  rawDocumentNumber: string | null = null;

  estados = ESTADOS_VENEZUELA;
  municipios: { id: string; nombre: string }[] = [];

  constructor(
    private fb: FormBuilder,
    private lookup: CedulaLookupService,
    private auth: AuthService,
    private snack: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.stepDocForm = this.fb.group({
      docType: ['V', Validators.required],
      docNumber: ['', Validators.required]
    });

    this.personalForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      id: ['', Validators.required],
      birthDate: ['', Validators.required],
      gender: ['']
    });

    this.addressForm = this.fb.group({
      estado: ['', Validators.required],
      municipio: ['', Validators.required],
      direccion: ['', Validators.required]
    });

    this.contactForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      phoneMobile: ['', Validators.required],
      phoneLocal: [''],
      role: ['user']
    }, { validators: this.passwordMatchValidator });

    this.verificacionForm = this.fb.group({
      acceptedTerms: [false, Validators.requiredTrue],
      bio: ['', Validators.maxLength(1000)]
    });
  }

  passwordMatchValidator(group: FormGroup) {
    const pw = group.get('password')?.value;
    const cpw = group.get('confirmPassword')?.value;
    return pw === cpw ? null : { mismatch: true };
  }

  onLookup() {
    const num = this.stepDocForm.value.docNumber;
    const type = this.stepDocForm.value.docType;
    if (!num) return;
    const MIN_VISIBLE_MS = 500; // min skeleton visible time to avoid flicker
    const start = Date.now();
    this.lookupInProgress = true;
    this.lookupError = null;

    // normalize digits (remove formatting) for lookup
    const rawNum = String(num).replace(/\D/g, '');
    // keep raw number for submission
    this.rawDocumentNumber = rawNum || null;
    // format visually in the input as thousands (e.g. 12.544.260)
    const formatted = rawNum ? this.formatDigits(rawNum) : num;
    // update the visible input to the formatted version
    this.stepDocForm.patchValue({ docNumber: formatted });

    this.lookup.lookup(type, rawNum).subscribe(res => {
      const elapsed = Date.now() - start;
      const wait = Math.max(0, MIN_VISIBLE_MS - elapsed);
      setTimeout(() => {
        this.lookupInProgress = false;
        // If the service returned a structured error
        if (res && (res as any).error) {
          const err = res as any;
          this.lookupResult = null;
          this.lookupError = err.message || 'Error realizando la búsqueda';
          return;
        }

        if (res && !(res as any).error) {
          // safe to assign as CedulaResult
          const candidate = res as CedulaResult;

          // Validate common placeholder/invalid values (e.g. birthDate = 0001-01-01 or '01/01/0001')
          const bdRaw = String(candidate.birthDate || '').trim();
          const isPlaceholderDate = bdRaw.length > 0 && (bdRaw.includes('0001') || bdRaw.startsWith('0001') || bdRaw === '01/01/0001');

          if (isPlaceholderDate) {
            // Treat as incomplete data: prefer manual entry and inform the user
            this.lookupResult = null;
            this.lookupError = 'Numero de documento no encontrado o incorrecto.';
            return;
          }

          this.lookupResult = candidate;
          // Do NOT overwrite the personal form yet; show suggestion card and let user confirm
        } else {
          this.lookupResult = null;
          this.lookupError = 'No se encontraron datos para esa cédula';
        }
      }, wait);
    }, (err) => {
      const elapsed = Date.now() - start;
      const wait = Math.max(0, MIN_VISIBLE_MS - elapsed);
      setTimeout(() => {
        this.lookupInProgress = false;
        this.lookupResult = null;
        this.lookupError = err?.message || 'Error de red al consultar la cédula';
      }, wait);
    });
  }

  private formatDigits(digits: string) {
    return digits.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }

  formatId(id: string | undefined | null) {
    if (!id) return '';
    const s = String(id).trim();
    const m = s.match(/^([A-Za-z]+)[-\s]?(\d+)$/);
    if (m) {
      const prefix = m[1].toUpperCase();
      const nums = m[2];
      return `${prefix}-${this.formatDigits(nums)}`;
    }
    const onlyDigits = s.replace(/\D/g, '');
    if (onlyDigits) return this.formatDigits(onlyDigits);
    return s;
  }

  onDocInput(event: Event) {
    const input = event.target as HTMLInputElement;
    const val = input.value || '';
    const raw = String(val).replace(/\D/g, '');
    this.rawDocumentNumber = raw || null;
    const formatted = raw ? this.formatDigits(raw) : '';
    // update the form control without emitting another input event
    this.stepDocForm.get('docNumber')?.setValue(formatted, { emitEvent: false });
    // move caret to end for a predictable UX
    setTimeout(() => {
      try { input.setSelectionRange(formatted.length, formatted.length); } catch (e) { /* ignore */ }
    });
  }

  useSuggested(confirm: boolean) {
    if (this.lookupResult && confirm) {
      // prefer `fullName` when available, otherwise fall back to firstName/lastName
      let fn = this.lookupResult.firstName || '';
      let ln = this.lookupResult.lastName || '';
      if (this.lookupResult.fullName) {
        const parts = this.lookupResult.fullName.replace(/\s+/g, ' ').trim().split(' ');
        const particles = ['DE','DEL','LA','LAS','LOS','Y','VAN','VON','MC','MAC','SAN','SANTA'];
        if (parts.length === 1) {
          fn = parts[0];
          ln = '';
        } else if (parts.length === 2) {
          fn = parts[0];
          ln = parts[1];
        } else {
          // default pick last two, but include particle before them if present
          let lastParts = parts.slice(-2);
          const maybeParticle = parts[parts.length - 3] ? parts[parts.length - 3].toUpperCase() : '';
          if (particles.includes(maybeParticle)) {
            lastParts = parts.slice(-3);
          }
          ln = lastParts.join(' ');
          fn = parts.slice(0, parts.length - lastParts.length).join(' ');
        }
      }
      this.personalForm.patchValue({ firstName: fn, lastName: ln, id: this.formatId(this.lookupResult.id), birthDate: this.lookupResult.birthDate ? new Date(this.lookupResult.birthDate) : '', gender: this.lookupResult.gender || '' });
    }
    // advance to next step regardless — user can still edit
    this.stepper.next();
  }

  useOnlyName() {
    if (!this.lookupResult) return;
    const full = this.lookupResult.fullName || `${this.lookupResult.firstName} ${this.lookupResult.lastName}`;
    this.personalForm.patchValue({ firstName: full, lastName: '', id: this.formatId(this.lookupResult.id), birthDate: this.lookupResult.birthDate ? new Date(this.lookupResult.birthDate) : '', gender: this.lookupResult.gender || '' });
    this.stepper.next();
  }

  editName() {
    // Go to identity step so user can edit name manually; do not modify values
    this.stepper.next();
  }

  onEstadoChange(estadoId: string) {
    const estado = this.estados.find(e => e.id === estadoId);
    this.municipios = estado ? estado.municipios : [];
    this.addressForm.patchValue({ municipio: '' });
  }

  onSubmit() {
    if (this.personalForm.invalid || this.addressForm.invalid || this.contactForm.invalid || this.verificacionForm.invalid) {
      this.snack.open('Por favor completa todos los campos requeridos.', 'Cerrar', { duration: 4000 });
      return;
    }

    const payload = {
      firstName: this.personalForm.value.firstName,
      lastName: this.personalForm.value.lastName,
      name: `${this.personalForm.value.firstName} ${this.personalForm.value.lastName}`,
      documentType: this.stepDocForm.value.docType,
      // send raw numeric document number (no dots) if available
      documentNumber: this.rawDocumentNumber || String(this.stepDocForm.value.docNumber).replace(/\D/g, ''),
      birthDate: this.personalForm.value.birthDate,
      estado: this.addressForm.value.estado,
      municipio: this.addressForm.value.municipio,
      direccion: this.addressForm.value.direccion,
      phoneMobile: this.contactForm.value.phoneMobile,
      phoneLocal: this.contactForm.value.phoneLocal,
      bio: this.verificacionForm.value.bio || null,
      email: this.contactForm.value.email,
      password: this.contactForm.value.password,
      role: this.contactForm.value.role
    };

    this.isSubmitting = true;
    this.auth.register(payload).subscribe({
      next: (res) => {
        // If register returned auth token (AuthService.handleAuth has stored it), we're already logged in
        if (this.auth.isAuthenticated()) {
          this.isSubmitting = false;
          this.snack.open('Registro exitoso. Bienvenido.', 'OK', { duration: 3000 });
          // Navegar al perfil del usuario recién autenticado
          const me = this.auth.getUser();
          this.router.navigate(['/perfil', me?.id || '']);
          return;
        }

        // Otherwise attempt to login automatically using the provided credentials
        this.auth.login({ email: payload.email, password: payload.password }).subscribe({
          next: () => {
              this.isSubmitting = false;
              this.snack.open('Registro exitoso. Sesión iniciada.', 'OK', { duration: 3000 });
              // Navegar al perfil del usuario
              const me2 = this.auth.getUser();
              this.router.navigate(['/perfil', me2?.id || '']);
          },
          error: (loginErr) => {
            this.isSubmitting = false;
            // Registration succeeded but auto-login failed — inform user and redirect to login
            const msg = loginErr?.error?.message || 'Registro completado, pero no se pudo iniciar sesión automáticamente.';
            this.snack.open(msg, 'OK', { duration: 6000 });
            this.router.navigate(['/auth/login']);
          }
        });
      },
      error: (err) => {
        this.isSubmitting = false;
        const msg = err?.error?.message || 'Error en el registro';
        this.snack.open(msg, 'Cerrar', { duration: 5000 });
      }
    });
  }

  cancel() {
    // Navigate back to the login page
    this.router.navigate(['/auth/login']);
  }
}
