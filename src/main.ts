import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

// If a reCAPTCHA site key is provided in environment, load the v3 script dynamically
const siteKey = (environment as any).recaptchaSiteKey;
if (siteKey) {
  const existing = document.querySelector(`script[data-recaptcha]`);
  if (!existing) {
    const s = document.createElement('script');
    s.src = `https://www.google.com/recaptcha/api.js?render=${siteKey}`;
    s.async = true;
    s.defer = true;
    s.setAttribute('data-recaptcha', 'true');
    document.head.appendChild(s);
  }
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
