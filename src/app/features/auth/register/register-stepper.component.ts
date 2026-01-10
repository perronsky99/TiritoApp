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
  lookupError = false;
  isSubmitting = false;

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
      birthDate: ['', Validators.required]
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
      acceptedTerms: [false, Validators.requiredTrue]
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
    this.lookupInProgress = true;
    this.lookupError = false;
    this.lookup.lookup(type, num).subscribe(res => {
      this.lookupInProgress = false;
      if (res) {
        this.lookupResult = res;
        // Do NOT overwrite the personal form yet; show suggestion card and let user confirm
        // (the form will be patched when the user confirms)
      } else {
        this.lookupResult = null;
        this.lookupError = true;
      }
    }, () => {
      this.lookupInProgress = false;
      this.lookupResult = null;
      this.lookupError = true;
    });
  }

  useSuggested(confirm: boolean) {
    if (this.lookupResult && confirm) {
      // prefer `fullName` when available, otherwise fall back to firstName/lastName
      let fn = this.lookupResult.firstName || '';
      let ln = this.lookupResult.lastName || '';
      if (this.lookupResult.fullName) {
        const parts = this.lookupResult.fullName.replace(/\s+/g, ' ').trim().split(' ');
        if (parts.length === 1) {
          fn = parts[0];
          ln = '';
        } else if (parts.length === 2) {
          fn = parts[0];
          ln = parts[1];
        } else {
          ln = parts.slice(-2).join(' ');
          fn = parts.slice(0, -2).join(' ');
        }
      }
      this.personalForm.patchValue({ firstName: fn, lastName: ln, id: this.lookupResult.id });
    }
    // advance to next step regardless — user can still edit
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
      documentNumber: this.stepDocForm.value.docNumber,
      birthDate: this.personalForm.value.birthDate,
      estado: this.addressForm.value.estado,
      municipio: this.addressForm.value.municipio,
      direccion: this.addressForm.value.direccion,
      phoneMobile: this.contactForm.value.phoneMobile,
      phoneLocal: this.contactForm.value.phoneLocal,
      email: this.contactForm.value.email,
      password: this.contactForm.value.password,
      role: this.contactForm.value.role
    };

    this.isSubmitting = true;
    this.auth.register(payload).subscribe({
      next: (res) => {
        this.isSubmitting = false;
        this.snack.open('Registro exitoso. Bienvenido.', 'OK', { duration: 3000 });
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.isSubmitting = false;
        const msg = err?.error?.message || 'Error en el registro';
        this.snack.open(msg, 'Cerrar', { duration: 5000 });
      }
    });
  }
}
