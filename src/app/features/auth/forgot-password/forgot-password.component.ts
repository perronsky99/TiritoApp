import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['../login/login.component.scss']
})
export class ForgotPasswordComponent {
  form: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private snack: MatSnackBar,
    private router: Router
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  submit() {
    if (this.form.invalid) return;
    this.loading = true;
    this.auth.requestPasswordReset(this.form.value.email).subscribe({
      next: () => {
        this.loading = false;
        this.snack.open('Si existe una cuenta con ese email, recibirás instrucciones.', 'OK', { duration: 5000 });
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.loading = false;
        const msg = err?.error?.message || 'No se pudo procesar la solicitud';
        this.snack.open(msg, 'Cerrar', { duration: 4000 });
      }
    });
  }
}
