import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AuthService } from './auth/auth.service';
import { AuthGuard } from './guards/auth.guard';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { TiritosService } from './services/tiritos.service';
import { ChatService } from './services/chat.service';
import { AnalyticsService } from './services/analytics.service';
import { ProfileService } from './services/profile.service';

/**
 * Core Module - Solo se importa en AppModule
 * Contiene servicios singleton y configuración global
 */
@NgModule({
  imports: [
    CommonModule,
    HttpClientModule
  ],
  providers: [
    AuthService,
    AuthGuard,
    TiritosService,
    ChatService,
    AnalyticsService,
    ProfileService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ]
})
export class CoreModule {
  /**
   * Previene que el CoreModule se importe más de una vez
   */
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error(
        'CoreModule ya está cargado. Importar solo en AppModule.'
      );
    }
  }
}
