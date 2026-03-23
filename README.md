# Tirito App – Frontend

> Cliente Angular 14 para la plataforma Tirito App.
> Publicacion, solicitud y gestion de "tiritos" (servicios informales) con chat en tiempo real, notificaciones, calificaciones, sistema de pagos y panel administrativo.

---

## Stack

| Capa | Tecnologia |
|------|-----------|
| Framework | Angular 14.2.0 |
| UI | Angular Material 14.2.0 + Angular CDK 14.2.0 |
| Reactivo | RxJS 7.5.0 |
| Realtime | socket.io-client 4.7.2 |
| Lenguaje | TypeScript 4.7.4 |
| Estilos | SCSS + CSS Custom Properties |
| Build | Angular CLI 14.2.0, Webpack |
| Deploy | Genezio (configurado via genezio.yaml) |

---

## Arquitectura

```
src/app/
  core/          Servicios singleton, guards, interceptors, modelos
  shared/        Componentes UI reutilizables, pipes, data, SharedModule
  features/      Modulos lazy-loaded por dominio funcional
  layouts/       Main layout (toolbar + sidenav + drawers)
```

**Integracion con backend:**
- REST API via `environment.apiUrl` (todas las operaciones CRUD)
- Socket.IO para notificaciones y chat en tiempo real (JWT en handshake)
- Proxy en desarrollo: `proxy.conf.json` redirige `/api/*` a `localhost:3000`

---

## Modulos y Funcionalidades

### Core (singleton – se importa solo en AppModule)

| Servicio | Responsabilidad |
|----------|----------------|
| AuthService | Login, registro, logout, token JWT, `currentUser$`, `isAuthenticated()` |
| TiritosService | CRUD tiritos, can-create, shared, filtros |
| ChatService | Chats por tirito, mensajes, `unreadCount$` |
| NotificationService | Notificaciones REST + Socket.IO + polling 30s |
| RatingService | Calificaciones: crear, pendientes, resumen |
| TiritoRequestsService | Solicitudes: crear, aceptar, rechazar |
| ProfileService | Perfil publico y propio |
| SearchService | Busqueda con cache LRU (50 entries) y dedup |
| PaymentService | Planes, suscripcion, transacciones (MOCK) |
| FavoritesService | CRUD favoritos |
| FavoritesStateService | Subject para sync estado de favoritos |
| ReferralService | Codigo referido, stats, validar |
| VerificationService | KYC: status, submit documentos |
| CategoryService | Categorias jerarquicas |
| CedulaLookupService | Consulta cedula venezolana externa |
| ReportService | Reportes: crear, listar, acciones admin |
| AdminService | Auditorias con filtros |
| AnalyticsService | Tracking local de eventos |

| Guard/Interceptor | Funcion |
|--------------------|---------|
| AuthGuard | Verifica autenticacion, redirige a `/login?returnUrl=...` |
| RoleGuard | Verifica rol (ej: `admin`) |
| AuthInterceptor | Inyecta `Authorization: Bearer <token>`, maneja 401 -> logout |

### Shared (SharedModule)

| Componente | Descripcion |
|-----------|-------------|
| LoadingSpinnerComponent | Spinner con mensaje opcional |
| EmptyStateComponent | Estado vacio con icono y texto |
| ErrorStateComponent | Estado de error con accion retry |
| VerificationBadgeComponent | Badge de estado de verificacion KYC |
| TiritoStatusBadgeComponent | Badge estado del tirito (open/in_progress/closed) |
| ImageUploadComponent | Upload de imagenes con drag & drop |
| NotificationDropdownComponent | Dropdown de notificaciones en toolbar |
| RatingDialogComponent | Dialog calificacion (1-5 estrellas + comentario) |
| ReportModalComponent | Modal para reportar usuario |
| BanModalComponent | Modal ban de usuario (admin) |
| SearchBarComponent | Busqueda con autocomplete y keyboard navigation |
| FavoritesDrawerComponent | Drawer lateral de favoritos |

| Pipe | Funcion |
|------|---------|
| RelativeTimePipe | "hace 5 minutos", "ayer" |
| TruncatePipe | Truncar texto a N caracteres |
| HighlightPipe | Highlight terminos de busqueda con `<mark>` |

| Data | Contenido |
|------|-----------|
| venezuela-locations.ts | 24 estados + municipios + tipos documento (V/E) |

### Features (lazy-loaded)

| Modulo | Ruta base | Componentes |
|--------|-----------|-------------|
| Auth | `/login`, `/auth/*` | LoginComponent, RegisterStepperComponent, ForgotPasswordComponent, ResetPasswordComponent |
| Home | `/` | HomeComponent (landing: ultimos tiritos + categorias + CTA) |
| Tiritos | `/tiritos` | TiritosListComponent, TiritoDetailComponent, TiritoCreateComponent |
| Chat | `/chat` | ChatListComponent, ChatConversationComponent |
| Profile | `/perfil` | ProfileViewComponent, VerificationComponent, ReferralsComponent |
| Notifications | `/notificaciones` | NotificationsListComponent |
| Requests | `/solicitudes` | RequestsUnifiedComponent (tabs: recibidas + enviadas) |
| Ratings | `/ratings` | PendingRatingsComponent |
| Payments | `/pagos` | PlansComponent (MOCK) |
| Favorites | `/favoritos` | FavoritesPageComponent |
| Admin | `/admin` | AdminReportsComponent, AdminAuditsComponent |

---

## Rutas

### Publicas (sin layout)

| Ruta | Componente |
|------|-----------|
| `/login` | LoginComponent |
| `/auth/register` | RegisterStepperComponent |
| `/auth/forgot` | ForgotPasswordComponent |
| `/auth/reset-password` | ResetPasswordComponent |

### Protegidas (MainLayoutComponent)

| Ruta | Componente | Guard |
|------|-----------|-------|
| `/` | HomeComponent | – |
| `/tiritos` | TiritosListComponent | – |
| `/tiritos/nuevo` | TiritoCreateComponent | AuthGuard |
| `/tiritos/:id` | TiritoDetailComponent | – |
| `/chat` | ChatListComponent | AuthGuard |
| `/chat/:id` | ChatConversationComponent | AuthGuard |
| `/notificaciones` | NotificationsListComponent | AuthGuard |
| `/solicitudes` | RequestsUnifiedComponent | AuthGuard |
| `/ratings` | PendingRatingsComponent | AuthGuard |
| `/perfil/verificacion` | VerificationComponent | AuthGuard |
| `/perfil/referidos` | ReferralsComponent | AuthGuard |
| `/perfil/:id` | ProfileViewComponent | AuthGuard |
| `/favoritos` | FavoritesPageComponent | AuthGuard |
| `/pagos/planes` | PlansComponent | AuthGuard |
| `/admin/reports` | AdminReportsComponent | AuthGuard + RoleGuard(admin) |
| `/admin/audits` | AdminAuditsComponent | AuthGuard + RoleGuard(admin) |
| `**` | Redirige a `/` | – |

---

## Endpoints HTTP Consumidos

El frontend se comunica con el backend via REST. Todos los endpoints usan el prefijo configurado en `environment.apiUrl`.

### Autenticacion
| Metodo | Endpoint | Servicio |
|--------|----------|----------|
| POST | `/api/auth/login` | AuthService |
| POST | `/api/auth/register` | AuthService |
| POST | `/api/auth/password/request` | AuthService |
| POST | `/api/auth/password/reset` | AuthService |

### Tiritos
| Metodo | Endpoint | Servicio |
|--------|----------|----------|
| GET | `/api/tiritos` | TiritosService |
| GET | `/api/tiritos/:id` | TiritosService |
| GET | `/api/tiritos/me` | TiritosService |
| GET | `/api/tiritos/can-create` | TiritosService |
| GET | `/api/tiritos/creator/:id` | TiritosService |
| GET | `/api/tiritos/shared/:userId` | TiritosService |
| POST | `/api/tiritos` | TiritosService (FormData multipart) |
| PATCH | `/api/tiritos/:id/status` | TiritosService |

### Chats y Mensajes
| Metodo | Endpoint | Servicio |
|--------|----------|----------|
| GET | `/api/chats` | ChatService |
| GET | `/api/chats/:tiritoId` | ChatService |
| POST | `/api/chats/:tiritoId/message` | ChatService |

### Solicitudes
| Metodo | Endpoint | Servicio |
|--------|----------|----------|
| POST | `/api/tirito-requests` | TiritoRequestsService |
| GET | `/api/tirito-requests/my` | TiritoRequestsService |
| GET | `/api/tirito-requests/sent` | TiritoRequestsService |
| GET | `/api/tirito-requests/tirito/:id/mine` | TiritoRequestsService |
| GET | `/api/tirito-requests/count` | TiritoRequestsService |
| PATCH | `/api/tirito-requests/:id/accept` | TiritoRequestsService |
| PATCH | `/api/tirito-requests/:id/reject` | TiritoRequestsService |

### Calificaciones
| Metodo | Endpoint | Servicio |
|--------|----------|----------|
| POST | `/api/ratings` | RatingService |
| GET | `/api/ratings/user/:userId` | RatingService |
| GET | `/api/ratings/summary/:userId` | RatingService |
| GET | `/api/ratings/pending` | RatingService |
| GET | `/api/ratings/tirito/:tiritoId` | RatingService |
| POST | `/api/ratings/request` | RatingService |

### Notificaciones
| Metodo | Endpoint | Servicio |
|--------|----------|----------|
| GET | `/api/notifications` | NotificationService |
| PATCH | `/api/notifications/:id` | NotificationService |
| PATCH | `/api/notifications/mark-all` | NotificationService |
| DELETE | `/api/notifications/:id` | NotificationService |

### Perfil y Usuarios
| Metodo | Endpoint | Servicio |
|--------|----------|----------|
| GET | `/api/profiles/:userId` | ProfileService |
| GET | `/api/users/me` | ProfileService |

### Favoritos
| Metodo | Endpoint | Servicio |
|--------|----------|----------|
| GET | `/api/users/me/favorites` | FavoritesService |
| POST | `/api/users/me/favorites/:id` | FavoritesService |
| DELETE | `/api/users/me/favorites/:id` | FavoritesService |

### Pagos (MOCK)
| Metodo | Endpoint | Servicio |
|--------|----------|----------|
| GET | `/api/payments/plans` | PaymentService |
| GET | `/api/payments/subscription` | PaymentService |
| POST | `/api/payments/subscribe` | PaymentService |
| POST | `/api/payments/cancel` | PaymentService |
| GET | `/api/payments/transactions` | PaymentService |

### Referidos
| Metodo | Endpoint | Servicio |
|--------|----------|----------|
| GET | `/api/referrals/code` | ReferralService |
| GET | `/api/referrals/stats` | ReferralService |
| POST | `/api/referrals/validate` | ReferralService |

### Verificacion KYC
| Metodo | Endpoint | Servicio |
|--------|----------|----------|
| GET | `/api/verification/status` | VerificationService |
| POST | `/api/verification/submit` | VerificationService |

### Categorias
| Metodo | Endpoint | Servicio |
|--------|----------|----------|
| GET | `/api/categories` | CategoryService |

### Reportes y Admin
| Metodo | Endpoint | Servicio |
|--------|----------|----------|
| POST | `/api/reports` | ReportService |
| GET | `/api/reports` | ReportService |
| POST | `/api/reports/:id/action` | ReportService |
| GET | `/api/admin/audits` | AdminService |

---

## Tema y Estilos

### Paleta de colores
| Nombre | Hex | Uso |
|--------|-----|-----|
| Primario (Azul) | `#3B82F6` | Botones principales, links, CTA |
| Acento (Ambar) | `#F59E0B` | Highlights, badges, acciones secundarias |
| Exito (Esmeralda) | `#10B981` | Confirmaciones, estados positivos |
| Fondo | `#F8FAFC` | Background general |
| Texto | `#1E293B` | Texto principal |
| Muted | `#64748B` | Texto secundario |
| Borde | `#E2E8F0` | Bordes y separadores |
| Card | `#FFFFFF` | Background de tarjetas |

### CSS Custom Properties
```css
--tirito-blue-500, --tirito-blue-600
--tirito-amber-500
--tirito-emerald-500
--tirito-bg, --tirito-text, --tirito-muted
--tirito-border, --tirito-card
--tirito-radius (14px), --tirito-radius-lg (20px)
--tirito-shadow, --tirito-shadow-md, --tirito-shadow-lg
```

### Tipografia
- **Fuente**: 'Inter', 'Roboto', sans-serif
- **Locale**: `es-VE`

---

## Seguridad

| Medida | Implementacion |
|--------|---------------|
| Autenticacion | JWT en localStorage, inyectado via AuthInterceptor |
| Rutas privadas | AuthGuard verifica token valido |
| Rutas admin | RoleGuard verifica `role: 'admin'` |
| Session expiry | 401 -> logout automatico + redirect a login |
| XSS | DomSanitizer para HTML dinamico, pipes con escape |
| Validaciones | ReactiveFormsModule: email, password min 8 chars, cedula, edad 18+ |
| Memory leaks | `takeUntil(destroy$)` en todas las suscripciones |
| Socket cleanup | Disconnect en ngOnDestroy |

---

## Instalacion

### Requisitos
- Node.js >= 16
- npm >= 8
- Backend corriendo en `localhost:3000` (o URL configurada)

### Pasos

```bash
# Clonar repositorio
git clone <repo-url>
cd TiritoApp

# Instalar dependencias
npm install

# Desarrollo (con proxy al backend)
npm start
# -> http://localhost:4200

# Build produccion
npm run build

# Tests unitarios
npm test

# Linting
npm run lint
```

### Configuracion de entorno

**Desarrollo** (`src/environments/environment.ts`):
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api'
};
```

**Produccion** (`src/environments/environment.prod.ts`):
```typescript
export const environment = {
  production: true,
  apiUrl: 'https://api.tirito.app/api'
};
```

---

## Contexto de Negocio

- **Pais objetivo**: Venezuela
- **Tipos de documento**: V (venezolano), E (extranjero)
- **Monedas**: VES, USD
- **Datos geograficos**: 24 estados + municipios en `shared/data/venezuela-locations.ts`
- **Roles**: `user`, `worker`, `business`
- **Verificacion KYC**: unverified -> pending -> verified / rejected
- **Planes**: Escalonados con limites de tiritos activos (sistema MOCK en v1)

---

## Licencia

MIT. Ver archivo LICENSE.md.

---

**Desarrollado por el equipo de Tirito App.**
