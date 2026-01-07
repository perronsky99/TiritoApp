import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface TiritoRequest {
  id: string;
  tirito: {
    id: string;
    title: string;
    description?: string;
    status?: string;
  };
  requester: {
    id: string;
    name: string;
    email: string;
  };
  message: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
}

export interface TiritoRequestsResponse {
  data: TiritoRequest[];
  total: number;
}

@Injectable({
  providedIn: 'root'
})
export class TiritoRequestsService {
  private readonly API_URL = `${environment.apiUrl}/tirito-requests`;

  constructor(private http: HttpClient) {}

  /**
   * Crear una solicitud para hacer un tirito
   */
  createRequest(tiritoId: string, message?: string): Observable<{ message: string; request: any }> {
    return this.http.post<{ message: string; request: any }>(this.API_URL, {
      tiritoId,
      message
    });
  }

  /**
   * Obtener solicitudes pendientes para mis tiritos (como creador)
   */
  getMyRequests(): Observable<TiritoRequestsResponse> {
    return this.http.get<TiritoRequestsResponse>(`${this.API_URL}/my`);
  }

  /**
   * Obtener mis solicitudes enviadas
   */
  getMySentRequests(): Observable<TiritoRequestsResponse> {
    return this.http.get<TiritoRequestsResponse>(`${this.API_URL}/sent`);
  }

  /**
   * Contar solicitudes pendientes (para badge)
   */
  getPendingCount(): Observable<{ count: number }> {
    return this.http.get<{ count: number }>(`${this.API_URL}/count`);
  }

  /**
   * Aceptar una solicitud
   */
  acceptRequest(requestId: string): Observable<{ message: string; request: any }> {
    return this.http.patch<{ message: string; request: any }>(`${this.API_URL}/${requestId}/accept`, {});
  }

  /**
   * Rechazar una solicitud
   */
  rejectRequest(requestId: string): Observable<{ message: string; request: any }> {
    return this.http.patch<{ message: string; request: any }>(`${this.API_URL}/${requestId}/reject`, {});
  }
}
