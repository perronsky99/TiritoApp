import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['../login/login.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  form: FormGroup;
  token: string | null = null;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private auth: AuthService,
    private snack: MatSnackBar,
    private router: Router
  ) {
    this.form = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.matchPasswords });
  }

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(params => {
      this.token = params.get('token');
    });
  }

  matchPasswords(group: FormGroup) {
    const pw = group.get('password')?.value;
    const cpw = group.get('confirmPassword')?.value;
    return pw === cpw ? null : { mismatch: true };
  }

  submit() {
    if (!this.token || this.form.invalid) return;
    this.loading = true;
    this.auth.resetPassword(this.token, this.form.value.password).subscribe({
      next: () => {
        this.loading = false;
        this.snack.open('Contraseña restablecida. Podés iniciar sesión ahora.', 'OK', { duration: 4000 });
        this.router.navigate(['/auth/login']);
      },
      error: (err) => {
        this.loading = false;
        const msg = err?.error?.message || 'No se pudo restablecer la contraseña';
        this.snack.open(msg, 'Cerrar', { duration: 5000 });
      }
    });
  }
}
