import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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
 * No analytics pesado
 */
@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  private readonly API_URL = `${environment.apiUrl}/analytics`;

  constructor(private http: HttpClient) {}

  /**
   * Registra un evento
   */
  trackEvent(event: AnalyticsEvent, metadata?: Record<string, unknown>): void {
    // Fire and forget - no bloqueamos UI por analytics
    this.http.post(`${this.API_URL}/events`, {
      event,
      metadata,
      timestamp: new Date().toISOString()
    }).subscribe({
      error: () => {
        // Silenciar errores de analytics - no son críticos
        console.warn('Analytics event failed:', event);
      }
    });
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
