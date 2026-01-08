import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

/**
 * Eventos básicos para métricas MVP
 * - tiritos_created: tiritos creados
 * - chats_started: chats iniciados
 * - tiritos_closed: tiritos cerrados
 */
export type AnalyticsEvent = 
  | 'tirito_created'
  | 'chat_started'
  | 'tirito_closed'
  | 'contact_initiated';

/**
 * Servicio de Analytics básico
 * Solo eventos mínimos requeridos para MVP
 * No analytics pesado - por ahora solo logging local
 */
@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  private readonly enabled = !environment.production; // Solo log en desarrollo

  constructor() {}

  /**
   * Registra un evento (solo logging local por ahora)
   */
  trackEvent(event: AnalyticsEvent, metadata?: Record<string, unknown>): void {
    if (this.enabled) {
      console.log('[Analytics]', event, metadata || '');
    }
    // TODO: Implementar backend de analytics cuando sea necesario
  }

  /**
   * Track cuando se crea un tirito
   */
  trackTiritoCreated(tiritoId: string): void {
    this.trackEvent('tirito_created', { tiritoId });
  }

  /**
   * Track cuando se inicia un chat
   */
  trackChatStarted(chatId: string, tiritoId: string): void {
    this.trackEvent('chat_started', { chatId, tiritoId });
  }

  /**
   * Track cuando se cierra un tirito
   */
  trackTiritoClosed(tiritoId: string): void {
    this.trackEvent('tirito_closed', { tiritoId });
  }

  /**
   * Track cuando se inicia contacto en un tirito
   */
  trackContactInitiated(tiritoId: string): void {
    this.trackEvent('contact_initiated', { tiritoId });
  }
}
