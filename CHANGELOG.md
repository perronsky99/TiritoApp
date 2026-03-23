# Changelog – Tirito App Frontend

Todos los cambios notables de este proyecto se documentan en este archivo.
Formato basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/).

---

## [0.2.0] – 2026-03-22

### Security
- Password minimo 8 caracteres en formularios de registro y reset
- Cleanup de suscripciones Socket.IO en ngOnDestroy
- takeUntil(destroy$) en todos los componentes con suscripciones activas
- Correccion de memory leaks en NotificationService y ChatService

### Changed
- SearchService: cache LRU con limite de 50 entradas (antes ilimitado)
- AuthInterceptor: manejo robusto de 401 con logout automatico

---

## [0.1.0] – 2026-01-06

### Added
- Sistema de notificaciones completo (REST + Socket.IO + polling 30s)
- NotificationDropdownComponent en toolbar con badge de no leidas
- NotificationsListComponent con agrupacion por fecha
- Sistema de reportes: ReportModalComponent + flujo completo
- Panel admin: AdminReportsComponent con acciones (ban, block, unban)
- Panel admin: AdminAuditsComponent con filtros (actor, target, accion, fechas)
- BanModalComponent para acciones administrativas
- Sistema de calificaciones: RatingDialogComponent (1-5 + comentario)
- PendingRatingsComponent para ratings pendientes
- VerificationBadgeComponent y TiritoStatusBadgeComponent
- Sistema de favoritos: FavoritesService + FavoritesPageComponent + FavoritesDrawerComponent
- Sistema de pagos MOCK: PlansComponent + PaymentService
- Sistema de referidos: ReferralsComponent + ReferralService
- Verificacion KYC: VerificationComponent + VerificationService
- SearchBarComponent con autocomplete y keyboard navigation
- ImageUploadComponent con drag and drop
- Pipes: RelativeTimePipe, TruncatePipe, HighlightPipe
- Analytics tracking local (AnalyticsService)
- Datos geograficos de Venezuela (24 estados + municipios)

---

## [0.0.1] – 2025-12-01

### Added
- Proyecto Angular 14 inicializado
- Core module: AuthService, AuthGuard, AuthInterceptor
- Feature modules: Auth (login/register), Home, Tiritos (list/detail/create), Chat, Profile
- MainLayoutComponent con toolbar y sidenav responsivo
- Tema Angular Material personalizado (paleta azul/ambar/esmeralda)
- Integracion con API REST del backend
- Socket.IO client para chat en tiempo real
- SharedModule con componentes basicos (LoadingSpinner, EmptyState, ErrorState)
- Configuracion de proxy para desarrollo
- Configuracion de deploy en Genezio
