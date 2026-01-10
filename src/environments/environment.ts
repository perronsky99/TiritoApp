/**
 * Environment configuration for development
 * apiUrl: URL base del backend API
 */
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api'
};

// Optional: reCAPTCHA site key for front-end (v3). If not set, captcha will be skipped on client.
// Add your key here or override in environment.prod.ts for production.
(environment as any).recaptchaSiteKey = '';
