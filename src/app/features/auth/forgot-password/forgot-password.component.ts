import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../core/auth/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';

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

    const sendRequest = (captchaToken?: string) => {
      this.auth.requestPasswordReset(this.form.value.email, captchaToken).subscribe({
        next: () => {
          this.loading = false;
          // Provide more helpful guidance to the user while keeping response generic
          this.snack.open('Si existe una cuenta con ese email, recibirás instrucciones. Revisa la carpeta de spam y puede tardar hasta 10 minutos.', 'OK', { duration: 8000 });
          this.router.navigate(['/']);
        },
        error: (err) => {
          this.loading = false;
          const msg = err?.error?.message || 'No se pudo procesar la solicitud';
          this.snack.open(msg, 'Cerrar', { duration: 4000 });
        }
      });
    };

    // If reCAPTCHA site key is provided in environment and grecaptcha is available, execute v3
    const siteKey = (environment as any).recaptchaSiteKey;
    const grecaptcha = (window as any).grecaptcha;
    if (siteKey && grecaptcha && typeof grecaptcha.execute === 'function') {
      grecaptcha.ready(() => {
        try {
          grecaptcha.execute(siteKey, { action: 'forgot_password' }).then((token: string) => {
            sendRequest(token);
          }).catch(() => {
            // fallback: send without captcha token
            sendRequest();
          });
        } catch (e) {
          sendRequest();
        }
      });
    } else {
      // no captcha configured on frontend — just send
      sendRequest();
    }
  }
}
