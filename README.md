# Tirito App v1.0 – Frontend (Documentación técnica)

Este documento ofrece una descripción técnica exhaustiva del cliente Angular, pensada para desarrolladores y analistas de sistemas. Cubre arquitectura, responsabilidades de módulos, flujos de datos, integraciones con el backend y procedimientos operativos.

Contenido:
- Visión general
- Arquitectura y módulos
- Componentes y servicios clave
- Flujo de autenticación y sockets
- Rutas importantes y vistas administrativas
- Cómo ejecutar, construir y desplegar
- Mantenimiento y extensiones

## Visión general

El frontend es una aplicación Angular (v14) que actúa como cliente para la API `BE` y proporciona interfaces para publicar/consumir "tiritos", chat en tiempo real, perfiles de usuario, notificaciones y paneles administrativos (reports/audits).

Puntos de integración con el backend:
- API REST en `environment.apiUrl` para operaciones CRUD y acciones administrativas.
- Socket.io para notificaciones y chat en tiempo real (token JWT en handshake).

## Arquitectura y módulos

Estructura principal en `src/app`:

- `core/` — Servicios singleton y utilidades globales:
	- `AuthService`: gestión de sesión, token y usuario actual.
	- `AuthGuard`: protección de rutas.
	- `AuthInterceptor`: añade `Authorization: Bearer <token>` a llamadas API.
	- Servicios de dominio: `TiritosService`, `ChatService`, `ReportService`, `AdminService`, `ProfileService`.

- `shared/` — Componentes y utilidades reutilizables:
	- UI: `ReportModalComponent`, `BanModalComponent`, `LoadingSpinner`, `EmptyState`, `ErrorState`.
	- Pipes y Material modules agrupados en `SharedModule`.

- `features/` — Funcionalidad por dominio:
	- `auth/`, `home/`, `tiritos/`, `chat/`, `profile/`, `admin/`, `notifications/`.

- `layouts/` — Componentes de layout (toolbar, sidenav, main layout).

## Componentes y servicios clave (detallado)

- `ReportModalComponent` (`shared/ui/report-modal`): modal que envía un POST a `/api/reports` con `{ targetId, category, description }`.
- `BanModalComponent` (`shared/ui/ban-modal`): modal administrativo que recopila `durationHours`, `reason` y `permanent` y retorna payload al `AdminReportsComponent`.
- `AdminReportsComponent` (`features/admin/admin-reports`): lista reportes y botones para ejecutar acciones (`ban`, `unban`, `user_block`) que llaman a `ReportService.actionReport(reportId, payload)`.
- `AdminAuditsComponent` (`features/admin/admin-audits`): vista para listar registros de auditoría, con filtros para actor, target, acción y rango de fechas.

Servicios relevantes:
- `ReportService` (`core/services/report.service.ts`): `createReport()`, `listReports()`, `actionReport()`.
- `AdminService` (`core/services/admin.service.ts`): `listAudits(filters)` para consumir `/api/admin/audits`.

## Flujos y secuencias importantes

1) Reportar usuario desde chat:
	- Usuario abre `ReportModalComponent` → envía `POST /api/reports` → backend crea `Report` y emite notificaciones según configuración.

2) Admin revisa y banea:
	- Admin abre `/admin/reports` → lista de reportes (GET `/api/reports`).
	- Admin abre `BanModalComponent`, completa parámetros → `ReportService.actionReport(reportId,{action:'ban', durationHours, reason})`.
	- Backend actualiza `User` y crea `Audit`. Frontend refresca la lista y muestra notificación (snackbar).

3) Notificaciones y chat en tiempo real:
	- Al autenticarse, `AuthService` expone token y `ChatService` conecta socket: `io(apiSocketUrl, { auth: { token } })`.
	- Servidor une sockets a sala `user_<userId>` para entregas dirigidas.

## Rutas y vistas administrativas

- `/admin/reports` — Lista de reportes con acciones (requiere rol `admin`).
- `/admin/audits` — Lista de logs de auditoría con filtros.

Ambas vistas están dentro del feature `admin` y requieren que el token corresponde a un usuario `role: 'admin'`.

## Requisitos de entorno y configuración

- Node.js >= 16
- npm
- Variables en `src/environments/environment.ts`:
	- `apiUrl` — URL base del backend (p. ej. `http://localhost:3000/api`).

## Ejecutar localmente

1. Instalar dependencias:
```bash
cd TiritoApp
npm install
```
2. Ajustar `src/environments/environment.ts` apuntando al backend.
3. Levantar el frontend:
```bash
npm start
```
4. Abrir `http://localhost:4200`.

## Construir para producción

```bash
npm run build
```

## Testing y calidad

- Ejecutar `npm test` para unit tests (si están configurados).
- Recomendado: añadir E2E (Protractor/Cypress) para flujos críticos (auth, report, admin actions).

## Buenas prácticas operativas

- No almacenar tokens sensibles en sesiones compartidas; usar `localStorage` o `sessionStorage` y limpiar en logout.
- Validar siempre las respuestas del backend y mostrar mensajes claros al usuario (snackbars o dialogs).
- Proteger vistas administrativas con `AuthGuard` y comprobaciones del rol en el servidor.

## Extensiones recomendadas

- Añadir paginación en `/api/admin/audits` y UI de auditoría si el volumen es alto.
- Añadir toasts y confirm dialogs más ricos para las acciones admin.

## Estructura de archivos (resumen)

```
src/
	app/
		core/
			services/
			guards/
			interceptors/
		shared/
			ui/
		features/
			admin/
			chat/
			tiritos/
		layouts/
```

## Contribuir

1. Fork -> nueva rama `feature/x`
2. Añadir tests y documentar cambios
3. PR con descripción técnica y pasos para QA

---

Si quieres, puedo generar además un archivo `DESIGN.md` con diagramas ASCII que describan los flujos (report -> admin -> ban) y la matriz de permisos. ¿Lo genero ahora?

---

## Instalación y Uso

1. Clona el repositorio:
	 ```sh
	 git clone https://github.com/TU_USUARIO/TiritoApp.git
	 cd TiritoApp
	 ```
2. Instala dependencias:
	 ```sh
	 npm install
	 ```
3. Inicia el servidor de desarrollo:
	 ```sh
	 npm start
	 ```
4. Abre [http://localhost:4200](http://localhost:4200) en tu navegador.

---

## Scripts Disponibles

- `npm start` – Servidor de desarrollo (Angular Live Server)
- `npm run build` – Compilar para producción
- `npm test` – Ejecutar tests unitarios
- `npm run lint` – Linting de código

---

## Módulos y Funcionalidades

### Core
- **AuthService**: Login, registro, logout, refresh token
- **AuthGuard**: Protección de rutas
- **AuthInterceptor**: Inyección de Bearer token, manejo de 401
- **TiritosService, ChatService, ProfileService, AnalyticsService**
- **Modelos**: user, tirito, chat, api

### Shared
- **Componentes**: loading-spinner, empty-state, error-state, verification-badge, tirito-status-badge, image-upload
- **Pipes**: relative-time, truncate

### Features
- **Auth**: Login y registro
- **Home**: Landing page, últimos tiritos
- **Tiritos**: Listado, detalle, crear tirito
- **Chat**: Lista de chats, conversación
- **Profile**: Ver perfil de usuario

### Layouts
- **MainLayout**: Toolbar, sidenav, router-outlet

---

## Estilos y Temas

- SCSS modular
- Tema Angular Material personalizado
- Responsive y accesible

---

## Ambientes

Configura la URL del backend en `src/environments/environment.ts`:

```ts
export const environment = {
	production: false,
	apiUrl: 'http://localhost:3000/api'
};
```

---

## Contribuir

1. Haz un fork del repositorio
2. Crea una rama (`git checkout -b feature/nueva-funcionalidad`)
3. Realiza tus cambios y haz commit
4. Haz push a tu rama y abre un Pull Request

---

## Licencia

MIT. Ver archivo LICENSE.md.

---

**Desarrollado por el equipo de Tirito App.**

## Table of Contents

* [Versions](#versions)
* [Demo](#demo)
* [Quick Start](#quick-start)
* [Deploy](#deploy)
* [Documentation](#documentation)
* [File Structure](#file-structure)
* [Browser Support](#browser-support)
* [Resources](#resources)
* [Reporting Issues](#reporting-issues)
* [Technical Support or Questions](#technical-support-or-questions)
* [Licensing](#licensing)
* [Useful Links](#useful-links)


## Versions

[<img src="https://github.com/creativetimofficial/public-assets/blob/master/logos/html-logo.jpg?raw=true" width="60" height="60" />](https://www.creative-tim.com/product/material-dashboard)
[<img src="https://github.com/creativetimofficial/public-assets/blob/master/logos/angular-logo.jpg?raw=true" width="60" height="60" />](https://www.creative-tim.com/product/material-dashboard-angular2)
[<img src="https://github.com/creativetimofficial/public-assets/blob/master/logos/vue-logo.jpg?raw=true" width="60" height="60" />](https://www.creative-tim.com/product/vue-material-dashboard)
[<img src="https://github.com/creativetimofficial/public-assets/blob/master/logos/react-logo.jpg?raw=true" width="60" height="60" />](https://www.creative-tim.com/product/material-dashboard-react)

| HTML | Angular | Vue | React |
| --- | --- | --- | --- |
| [![Material Dashboard HTML](https://github.com/creativetimofficial/public-assets/blob/master/material-dashboard-html/material-dashboard.jpg?raw=true)](https://www.creative-tim.com/product/material-dashboard) | [![Material Dashboard Angular](https://github.com/creativetimofficial/public-assets/blob/master/material-dashboard-angular/material-dashboard-angular.jpg?raw=true)](https://www.creative-tim.com/product/material-dashboard-angular2) | [![Vue Material Dashboard ](https://github.com/creativetimofficial/public-assets/blob/master/vue-material-dashboard/vue-material-dashboard.jpg?raw=true)](https://www.creative-tim.com/product/vue-material-dashboard) | [![Material Dashboard React](https://github.com/creativetimofficial/public-assets/blob/master/material-dashboard-react/material-dashboard-react.jpg?raw=true)](https://www.creative-tim.com/product/material-dashboard-react)

## Demo

| Dashboard | User Profile | Tables | Icons | Notifications |
| --- | --- | --- | --- | --- |
| [![Start page](https://raw.githubusercontent.com/creativetimofficial/public-assets/master/material-dashboard-angular/dashboard.png?raw=true)](https://demos.creative-tim.com/material-dashboard-angular2/#/dashboard) | [![User profile page](https://raw.githubusercontent.com/creativetimofficial/public-assets/master/material-dashboard-angular/user-profile.png?raw=true)](https://demos.creative-tim.com/material-dashboard-angular2/#/user-profile) | [![Tables page ](https://raw.githubusercontent.com/creativetimofficial/public-assets/master/material-dashboard-angular/tables.png?raw=true)](https://demos.creative-tim.com/material-dashboard-angular2/#/table-list) | [![Icons Page](https://raw.githubusercontent.com/creativetimofficial/public-assets/master/material-dashboard-angular/icons.png?raw=true)](https://demos.creative-tim.com/material-dashboard-angular2/#/maps) | [![Notifications page](https://raw.githubusercontent.com/creativetimofficial/public-assets/master/material-dashboard-angular/notifications.png?raw=true)](https://demos.creative-tim.com/material-dashboard-angular2/#/notifications)

[View More](https://demos.creative-tim.com/material-dashboard-angular2/#/dashboard).

## Quick start

Quick start options:

- [Download from Github](https://github.com/tiniestory/material-dashboard-angular2/archive/master.zip).
- [Download from Creative Tim](http://www.creative-tim.com/product/material-dashboard-angular2).

## Deploy

:rocket: You can deploy your own version of the template to Genezio with one click:

[![Deploy to Genezio](https://raw.githubusercontent.com/Genez-io/graphics/main/svg/deploy-button.svg)](https://app.genez.io/start/deploy?repository=https://github.com/creativetimofficial/material-dashboard-angular2&utm_source=github&utm_medium=referral&utm_campaign=github-creativetim&utm_term=deploy-project&utm_content=button-head)

## Terminal Commands

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 1.0.0 and angular 4.x.

1. Install NodeJs from [NodeJs Official Page](https://nodejs.org/en).
2. Open Terminal
3. Go to your file project
4. Make sure you have installed [Angular CLI](https://github.com/angular/angular-cli) already. If not, please install.
5. Run in terminal: ```npm install```
6. Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

### What's included

Within the download you'll find the following directories and files:

```
material-dashboard-angular
├── CHANGELOG.md
├── LICENSE.md
├── README.md
├── angular-cli.json
├── documentation
├── e2e
├── karma.conf.js
├── package-lock.json
├── package.json
├── protractor.conf.js
├── src
│   ├── app
│   │   ├── app.component.css
│   │   ├── app.component.html
│   │   ├── app.component.spec.ts
│   │   ├── app.component.ts
│   │   ├── app.module.ts
│   │   ├── app.routing.ts
│   │   ├── components
│   │   │   ├── components.module.ts
│   │   │   ├── footer
│   │   │   │   ├── footer.component.css
│   │   │   │   ├── footer.component.html
│   │   │   │   ├── footer.component.spec.ts
│   │   │   │   └── footer.component.ts
│   │   │   ├── navbar
│   │   │   │   ├── navbar.component.css
│   │   │   │   ├── navbar.component.html
│   │   │   │   ├── navbar.component.spec.ts
│   │   │   │   └── navbar.component.ts
│   │   │   └── sidebar
│   │   │       ├── sidebar.component.css
│   │   │       ├── sidebar.component.html
│   │   │       ├── sidebar.component.spec.ts
│   │   │       └── sidebar.component.ts
│   │   ├── dashboard
│   │   │   ├── dashboard.component.css
│   │   │   ├── dashboard.component.html
│   │   │   ├── dashboard.component.spec.ts
│   │   │   └── dashboard.component.ts
│   │   ├── icons
│   │   │   ├── icons.component.css
│   │   │   ├── icons.component.html
│   │   │   ├── icons.component.spec.ts
│   │   │   └── icons.component.ts
│   │   ├── layouts
│   │   │   └── admin-layout
│   │   │       ├── admin-layout.component.html
│   │   │       ├── admin-layout.component.scss
│   │   │       ├── admin-layout.component.spec.ts
│   │   │       ├── admin-layout.component.ts
│   │   │       ├── admin-layout.module.ts
│   │   │       └── admin-layout.routing.ts
│   │   ├── maps
│   │   │   ├── maps.component.css
│   │   │   ├── maps.component.html
│   │   │   ├── maps.component.spec.ts
│   │   │   └── maps.component.ts
│   │   ├── notifications
│   │   │   ├── notifications.component.css
│   │   │   ├── notifications.component.html
│   │   │   ├── notifications.component.spec.ts
│   │   │   └── notifications.component.ts
│   │   ├── table-list
│   │   │   ├── table-list.component.css
│   │   │   ├── table-list.component.html
│   │   │   ├── table-list.component.spec.ts
│   │   │   └── table-list.component.ts
│   │   ├── typography
│   │   │   ├── typography.component.css
│   │   │   ├── typography.component.html
│   │   │   ├── typography.component.spec.ts
│   │   │   └── typography.component.ts
│   │   ├── upgrade
│   │   │   ├── upgrade.component.css
│   │   │   ├── upgrade.component.html
│   │   │   ├── upgrade.component.spec.ts
│   │   │   └── upgrade.component.ts
│   │   └── user-profile
│   │       ├── user-profile.component.css
│   │       ├── user-profile.component.html
│   │       ├── user-profile.component.spec.ts
│   │       └── user-profile.component.ts
│   ├── assets
│   │   ├── css
│   │   │   └── demo.css
│   │   ├── img
│   │   └── scss
│   │       ├── core
│   │       └── material-dashboard.scss
│   ├── environments
│   ├── favicon.ico
│   ├── index.html
│   ├── main.ts
│   ├── polyfills.ts
│   ├── styles.css
│   ├── test.ts
│   ├── tsconfig.app.json
│   ├── tsconfig.spec.json
│   └── typings.d.ts
├── tsconfig.json
├── tslint.json
└── typings

```

## Browser Support

At present, we officially aim to support the last two versions of the following browsers:

<img src="https://s3.amazonaws.com/creativetim_bucket/github/browser/chrome.png" width="64" height="64"> <img src="https://s3.amazonaws.com/creativetim_bucket/github/browser/firefox.png" width="64" height="64"> <img src="https://s3.amazonaws.com/creativetim_bucket/github/browser/edge.png" width="64" height="64"> <img src="https://s3.amazonaws.com/creativetim_bucket/github/browser/safari.png" width="64" height="64"> <img src="https://s3.amazonaws.com/creativetim_bucket/github/browser/opera.png" width="64" height="64">



## Resources
- Demo: <https://demos.creative-tim.com/material-dashboard-angular2/#/dashboard>
- Download Page: <https://www.creative-tim.com/product/material-dashboard-angular2>
- Documentation: <https://demos.creative-tim.com/material-dashboard-angular2/#/documentation/tutorial>
- License Agreement: <https://www.creative-tim.com/license>
- Support: <https://www.creative-tim.com/contact-us>
- Issues: [Github Issues Page](https://github.com/creativetimofficial/material-dashboard-angular2/issues)
- [Material Kit](https://www.creative-tim.com/product/material-kit?ref=github-mda-free) - For Front End Development

## Reporting Issues

We use GitHub Issues as the official bug tracker for the Material Dashboard. Here are some advices for our users that want to report an issue:

1. Make sure that you are using the latest version of the Material Dashboard. Check the CHANGELOG from your dashboard on our [website](https://www.creative-tim.com/).
2. Providing us reproducible steps for the issue will shorten the time it takes for it to be fixed.
3. Some issues may be browser specific, so specifying in what browser you encountered the issue might help.


## Technical Support or Questions

If you have questions or need help integrating the product please [contact us](https://www.creative-tim.com/contact-us) instead of opening an issue.



## Licensing

- Copyright 2018 Creative Tim (https://www.creative-tim.com/)

- Licensed under MIT (https://github.com/creativetimofficial/material-dashboard-angular2/blob/master/LICENSE.md)


## Useful Links

- [More products](https://www.creative-tim.com/bootstrap-themes) from Creative Tim
- [Tutorials](https://www.youtube.com/channel/UCVyTG4sCw-rOvB9oHkzZD1w)
- [Freebies](https://www.creative-tim.com/bootstrap-themes/free) from Creative Tim
- [Affiliate Program](https://www.creative-tim.com/affiliates/new) (earn money)

##### Social Media

Twitter: <https://twitter.com/CreativeTim>

Facebook: <https://www.facebook.com/CreativeTim>

Dribbble: <https://dribbble.com/creativetim>

Google+: <https://plus.google.com/+CreativetimPage>

Instagram: <https://www.instagram.com/CreativeTimOfficial>

[CHANGELOG]: ./CHANGELOG.md

[version-badge]: https://img.shields.io/badge/version-2.8.0-blue.svg
