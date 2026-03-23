# MASTER PROMPT - TIRITO APP FRONTEND (Version Actual)

**Angular 14 - Angular Material - RxJS 7 - Socket.IO Client - Pragmatic Mode**

Ultima actualizacion: 2026-03-22

---

## CONTEXTO GENERAL (OBLIGATORIO)

Estas trabajando sobre el FRONTEND REAL de una aplicacion llamada **Tirito App**.

Este frontend NO es prototipo, NO es demo, NO es wireframe.
Es una app Angular 14 real y funcional, en camino a produccion (beta cerrada).

El backend (Node.js + Express + MongoDB) ya esta construido y es la UNICA fuente de verdad.
**El frontend MUESTRA, el backend DECIDE.**

---

## FILOSOFIA Y PRINCIPIOS INMUTABLES

1. **Pragmatismo**: Angular Material + componentes simples. Nada artesanal.
2. **El backend manda**: toda validacion critica esta en el servidor. El frontend solo valida UX.
3. **Cero sobreingenieria**: no NgRx, no state management complejo, no micro-frontends.
4. **Cambios quirurgicos**: no refactorizar codigo que funciona sin motivo.
5. **Accesibilidad basica**: labels, focus management, responsive.

### Prohibido:
- NgRx / NGXS / Akita (state management externo)
- Micro-frontends
- SSR (Server Side Rendering) en v1
- Service Workers / PWA en v1
- Custom design system (usar Angular Material)
- Dependencias CSS externas innecesarias

---

## STACK OBLIGATORIO

- **Angular** 14.2.0
- **Angular Material** 14.2.0
- **Angular CDK** 14.2.0
- **RxJS** 7.5.0
- **TypeScript** 4.7.4
- **Socket.IO Client** 4.7.2
- **SCSS** (modular, variables CSS custom)
- **Proxy** en desarrollo (`proxy.conf.json` -> localhost:3000)

---

## ESTRUCTURA DEL PROYECTO (DEFINITIVA)

```
src/
  app/
    app.module.ts              # Root module
    app.component.ts           # Root component
    app-routing.module.ts      # Rutas principales con lazy loading
    core/
      core.module.ts           # Servicios singleton (importar solo en AppModule)
      auth/
        auth.service.ts        # Login, register, logout, token management
      guards/
        auth.guard.ts          # Verifica autenticacion, redirige a /login
        role.guard.ts          # Verifica rol (ej: admin)
      interceptors/
        auth.interceptor.ts    # Inyecta Bearer token, maneja 401
      models/
        user.model.ts          # User, LoginCredentials, RegisterData, AuthResponse
        tirito.model.ts        # Tirito, TiritoFilters, TiritosResponse
        chat.model.ts          # Chat, ChatMessage, ChatParticipant
        api.model.ts           # ApiResponse, LoadingState, PaginatedResponse
      services/
        tiritos.service.ts     # CRUD tiritos, can-create, shared
        chat.service.ts        # Chats, mensajes, unreadCount$
        profile.service.ts     # Perfil publico, mi perfil, verificacion
        notification.service.ts # Notificaciones REST + Socket.IO + polling
        report.service.ts      # Reportes: crear, listar, acciones
        admin.service.ts       # Audits admin
        rating.service.ts      # Calificaciones: crear, consultar, pendientes
        search.service.ts      # Busqueda con cache LRU y dedup
        analytics.service.ts   # Tracking local de eventos
        payment.service.ts     # Planes, suscripcion, transacciones (MOCK)
        referral.service.ts    # Referidos: codigo, stats, validar
        category.service.ts    # Categorias jerarquicas
        cedula-lookup.service.ts # Consulta cedula externa
        favorites.service.ts   # CRUD favoritos
        favorites-state.service.ts # Subject para sync favoritos
        verification.service.ts # KYC: status, submit
      components/
        search-bar/            # Busqueda con autocomplete y keyboard nav
    shared/
      shared.module.ts         # Material modules + componentes reutilizables
      ui/
        loading-spinner/       # Spinner con mensaje
        error-state/           # Estado de error
        empty-state/           # Estado vacio
        verification-badge/    # Badge de verificacion
        tirito-status-badge/   # Badge de estado tirito
        image-upload/          # Upload imagenes (drag & drop)
        notification-dropdown/ # Dropdown notificaciones
        rating-dialog/         # Dialogo valoracion (1-5 + comment)
        report-modal/          # Modal reporte de usuario
        ban-modal/             # Modal ban (admin)
      pipes/
        relative-time.pipe.ts  # "hace 5 minutos"
        truncate.pipe.ts       # Truncar texto
        highlight.pipe.ts      # Highlight busqueda con <mark>
      data/
        venezuela-locations.ts # 24 estados + municipios + tipos documento
    features/
      auth/
        login/                 # Login + registro (toggle)
        register-stepper/      # Registro multi-paso con stepper
        forgot-password/       # Solicitar reset
        reset-password/        # Ejecutar reset
      home/                    # Landing: tiritos recientes + categorias + CTA
      tiritos/
        tiritos-list/          # Grid/lista con filtros, busqueda, paginacion
        tirito-detail/         # Detalle con galeria, acciones, favoritos
        tirito-create/         # Crear tirito con upload imagenes
      chat/
        chat-list/             # Lista de conversaciones
        chat-conversation/     # Chat con mensajes, scroll, Socket.IO
      profile/
        profile-view/          # Perfil publico/propio con ratings
        verification/          # KYC: upload 3 documentos
        referrals/             # Codigo referral + stats
      notifications/
        notifications-list/    # Lista agrupada por fecha
      requests/
        requests-unified/      # Tab: recibidas + enviadas
      ratings/
        pending-ratings/       # Lista de ratings pendientes
      payments/
        plans/                 # Grid de planes (MOCK)
      favorites/
        favorites-page/        # Mis favoritos paginados
      admin/
        admin-reports/         # Reportes con acciones (ban, block)
        admin-audits/          # Logs de auditoria con filtros
    layouts/
      main-layout/             # Toolbar + sidenav + drawers + router-outlet
      favorites-drawer/        # Drawer lateral de favoritos
  environments/
    environment.ts             # { production: false, apiUrl: 'http://localhost:3000/api' }
    environment.prod.ts        # { production: true, apiUrl: 'https://api.tirito.app/api' }
  styles.scss                  # Tema Material + variables CSS custom + tipografia
```

**No inventar carpetas. No crear feature modules innecesarios. No duplicar servicios.**

---

## RUTAS (DEFINITIVAS)

### Publicas (sin layout)
- `/login` - LoginComponent
- `/auth/register` - RegisterStepperComponent
- `/auth/forgot` - ForgotPasswordComponent
- `/auth/reset-password` - ResetPasswordComponent

### Con layout principal (MainLayoutComponent)
- `/` - HomeComponent
- `/tiritos` - TiritosListComponent (publica)
- `/tiritos/nuevo` - TiritoCreateComponent [AuthGuard]
- `/tiritos/:id` - TiritoDetailComponent (publica)
- `/chat` - ChatListComponent [AuthGuard]
- `/chat/:id` - ChatConversationComponent [AuthGuard]
- `/notificaciones` - NotificationsListComponent [AuthGuard]
- `/solicitudes` - RequestsUnifiedComponent [AuthGuard]
- `/ratings` - PendingRatingsComponent [AuthGuard]
- `/perfil/verificacion` - VerificationComponent [AuthGuard]
- `/perfil/referidos` - ReferralsComponent [AuthGuard]
- `/perfil/:id` - ProfileViewComponent [AuthGuard]
- `/favoritos` - FavoritesPageComponent [AuthGuard]
- `/pagos/planes` - PlansComponent [AuthGuard]
- `/admin/reports` - AdminReportsComponent [AuthGuard + RoleGuard(admin)]
- `/admin/audits` - AdminAuditsComponent [AuthGuard + RoleGuard(admin)]
- `**` - Redirige a `/`

---

## SERVICIOS Y ENDPOINTS HTTP

### AuthService
- `POST /api/auth/login` - login(email, password)
- `POST /api/auth/register` - register(RegisterData)
- `POST /api/auth/password/request` - requestPasswordReset(email, captchaToken?)
- `POST /api/auth/password/reset` - resetPassword(token, password)
- localStorage: `tirito_jwt_token`, `tirito_user`
- `currentUser$` BehaviorSubject, `isAuthenticated()`, `logout()`

### TiritosService
- `GET /api/tiritos` - getTiritos(filters?)
- `GET /api/tiritos/:id` - getTiritoById(id)
- `GET /api/tiritos/creator/:id` - getTiritosByCreator(creatorId, page, limit)
- `POST /api/tiritos` - createTirito(FormData multipart)
- `PATCH /api/tiritos/:id/status` - markInProgress(id), closeTirito(id)
- `GET /api/tiritos/me` - getMyTiritos()
- `GET /api/tiritos/can-create` - canCreateTirito()
- `GET /api/tiritos/shared/:userId` - checkSharedTiritos(userId)

### ChatService
- `GET /api/chats` - getMyChats()
- `GET /api/chats/:tiritoId` - getChat(tiritoId, withUser?)
- `POST /api/chats/:tiritoId/message` - sendMessage(tiritoId, content)
- `unreadCount$` Subject

### NotificationService
- `GET /api/notifications` - getNotifications(onlyUnread?, limit?, skip?)
- `PATCH /api/notifications/:id` - markAsRead(id)
- `PATCH /api/notifications/mark-all` - markAllAsRead()
- `DELETE /api/notifications/:id` - deleteNotification(id)
- Socket.IO: `chat_message` event via `chatMessage$`
- Polling cada 30 segundos
- `unreadCount$`, `notifications$` Observables

### RatingService
- `POST /api/ratings` - createRating(payload)
- `GET /api/ratings/user/:userId` - getRatingsForUser(userId)
- `GET /api/ratings/summary/:userId` - getSummary(userId)
- `GET /api/ratings/pending` - getPendingRatings()
- `GET /api/ratings/tirito/:tiritoId` - getRatingsForTirito(tiritoId)
- `POST /api/ratings/request` - requestRating(tiritoId)

### TiritoRequestsService
- `POST /api/tirito-requests` - createRequest(tiritoId, message?)
- `GET /api/tirito-requests/my` - getMyRequests()
- `GET /api/tirito-requests/sent` - getMySentRequests()
- `GET /api/tirito-requests/tirito/:id/mine` - getMyRequestForTirito(tiritoId)
- `GET /api/tirito-requests/count` - getPendingCount()
- `PATCH /api/tirito-requests/:id/accept` - acceptRequest(requestId)
- `PATCH /api/tirito-requests/:id/reject` - rejectRequest(requestId)

### ProfileService
- `GET /api/profiles/:userId` - getProfile(userId)
- `GET /api/users/me` - getMyProfile()

### PaymentService
- `GET /api/payments/plans` - getPlans()
- `GET /api/payments/subscription` - getSubscription()
- `POST /api/payments/subscribe` - subscribe(plan, paymentMethod?)
- `POST /api/payments/cancel` - cancelSubscription()
- `GET /api/payments/transactions` - getTransactions(page)

### FavoritesService
- `GET /api/users/me/favorites` - getFavorites(page, limit)
- `POST /api/users/me/favorites/:id` - addFavorite(tiritoId)
- `DELETE /api/users/me/favorites/:id` - removeFavorite(tiritoId)

### SearchService - Busqueda con cache LRU (max 50) y dedup de requests
### CategoryService - `GET /api/categories`
### ReportService - Crear, listar, acciones sobre reportes
### AdminService - Audits con filtros
### ReferralService - Codigo, stats, validar
### VerificationService - Status, submit documentos
### CedulaLookupService - Consulta cedula externa
### AnalyticsService - Tracking local (tirito_created, chat_started, etc.)

---

## MODELOS TYPESCRIPT (DEFINITIVOS)

### User
```typescript
type Role = 'user' | 'worker' | 'business'
type VerificationStatus = 'unverified' | 'pending' | 'verified' | 'rejected'
type DocumentType = 'V' | 'E'

interface User {
  id: string; email: string; name: string; firstName?: string; lastName?: string;
  username?: string; documentType?: DocumentType; documentNumber?: string;
  birthDate?: string; estado?: string; municipio?: string; direccion?: string;
  phoneMobile?: string; phoneLocal?: string; role: Role;
  verificationStatus: VerificationStatus; avatar?: string; bio?: string | null;
  createdAt: string; updatedAt: string;
}
```

### Tirito
```typescript
type TiritoStatus = 'open' | 'in_progress' | 'closed'

interface Tirito {
  id: string; title: string; description: string; status: TiritoStatus;
  images: TiritoImage[]; creatorId: string; creatorName: string;
  creatorInitials?: string; creatorAvatar?: string;
  assignedTo?: string; assignedToName?: string; location?: string;
  createdAt: string; updatedAt: string;
}
```

---

## PALETA DE COLORES (INMUTABLE)

```
Primario (Azul):     #3B82F6 (500) - Botones principales, links, CTA
Acento (Ambar):      #F59E0B (500) - Highlights, badges, acciones secundarias
Exito (Esmeralda):   #10B981 (500) - Confirmaciones, estados positivos
Fondo:               #F8FAFC
Texto principal:     #1E293B
Texto muted:         #64748B
Borde:               #E2E8F0
Card:                #FFFFFF
Border radius:       14px (normal), 20px (large)
Font:                'Inter', 'Roboto', sans-serif
```

### Variables CSS Custom
```css
--tirito-blue-500, --tirito-blue-600
--tirito-amber-500
--tirito-emerald-500
--tirito-bg, --tirito-text, --tirito-muted
--tirito-border, --tirito-card
--tirito-radius, --tirito-radius-lg
--tirito-shadow, --tirito-shadow-md, --tirito-shadow-lg
```

---

## DATOS GEOGRAFICOS (INMUTABLES)

- **Pais**: Venezuela
- **Tipos de documento**: V (venezolano), E (extranjero)
- **24 estados** con sus municipios (archivo: `shared/data/venezuela-locations.ts`)
- **Monedas**: VES, USD

---

## FLUJOS PRINCIPALES

### Autenticacion
1. Login/registro en `/login` (toggle) o `/auth/register` (stepper)
2. Token + user se guardan en localStorage
3. AuthInterceptor inyecta Bearer token
4. 401 = logout automatico + redirige a `/login?returnUrl=...`

### Crear Tirito
1. `/tiritos/nuevo` [AuthGuard]
2. Verificar `canCreateTirito()` (limite segun plan)
3. Formulario + upload imagenes (max 5, 5MB)
4. POST FormData multipart
5. Redirige a detalle del tirito creado

### Solicitud y Asignacion
1. Visitante ve tirito abierto -> "Solicitar trabajar"
2. Creador recibe solicitud en `/solicitudes` (tab recibidas)
3. Acepta -> tirito pasa a in_progress, solicitante asignado
4. Chat habilitado entre creador y asignado

### Chat
1. `/chat/:tiritoId` con query `?withUser=` (para creadores)
2. Mensajes historicos via REST + nuevos via Socket.IO
3. Enter=enviar, Shift+Enter=salto de linea
4. Creador puede completar tirito desde el chat

### Calificaciones
1. Tirito cerrado -> participantes pueden calificar
2. Rating dialog: score (1-5) + comment
3. Solo participantes, no auto-calificacion

---

## SEGURIDAD FRONTEND

1. **Token JWT** en localStorage, inyectado via interceptor
2. **AuthGuard** protege rutas privadas
3. **RoleGuard** protege rutas admin
4. **401 handling**: logout + redirige
5. **XSS**: DomSanitizer para HTML dinamico, pipes con escape
6. **Validaciones**: ReactiveFormsModule, email format, password min 8, cedula pattern, edad 18+
7. **Leaks**: takeUntil(destroy$) en suscripciones, ngOnDestroy en servicios Socket
8. **CSRF**: JWT en header (no cookie) = proteccion inherente

---

## LOCALE Y FORMATO

- `MAT_DATE_LOCALE: 'es-VE'`
- Fechas relativas en espanol ("hace 5 minutos", "ayer")
- Texto de interfaz en espanol

---

## ESTILO DE CODIGO

- Componentes standalone cuando sea posible
- Servicios inyectados via `providedIn: 'root'` o CoreModule
- Observables con pipe operators, no subscribe anidados
- takeUntil(destroy$) para cleanup
- BehaviorSubject para estado compartido
- Nombres en espanol para labels, ingles para codigo
- SCSS modular, variables CSS custom (no inline styles)

---

## REGLA CRÍTICA - NO ROMPER FUNCIONALIDAD EXISTENTE

- NO modificar endpoints existentes
- NO cambiar nombres de servicios
- NO alterar contratos HTTP actuales
- NO eliminar código existente sin justificación explícita
- NO refactorizar AuthService, Interceptors o Guards sin pedir confirmación
- NO cambiar estructura de módulos o rutas existentes

Cualquier cambio debe ser ADITIVO, no destructivo. Si es necesario modificar algo, primero validar que no rompa nada y luego agregar el nuevo código sin eliminar el anterior (de ser posible).

---

## UI/UX ESPECÍFICO (OBLIGATORIO)

- Si se pide un stepper, DEBE ser Angular Material Stepper (MatStepper)
- NO reemplazar layouts existentes sin confirmación
- NO usar componentes custom si Angular Material tiene equivalente
- Mantener consistencia visual con Material (inputs, botones, spacing)

Si una funcionalidad UI no coincide con lo pedido, es un ERROR.

---

## MODO DE EJECUCIÓN

- Implementar EXACTAMENTE lo solicitado
- No interpretar, no simplificar, no omitir partes
- Si algo no está claro, asumir la opción más completa
- No entregar soluciones parciales

---

## CONTRATO FINAL

Este frontend sirve a usuarios de Tirito App. Se conecta al backend via REST + Socket.IO. No se sobrearquitecta. No se agrega state management externo. No se reescribe sin motivo. **La paleta de colores, la estructura de rutas, los modelos de datos y los flujos aqui documentados son la FUENTE DE VERDAD.** Antes de modificar cualquier aspecto, validar que no contradiga este documento.

**Al trabajar con este frontend:** leer este documento PRIMERO, respetar rutas y estructura definidas, no agregar dependencias sin justificacion, mantener cleanup de suscripciones (takeUntil), respetar la paleta de colores.
