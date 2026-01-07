import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { 
  Tirito, 
  CreateTiritoData, 
  TiritoFilters, 
  TiritosResponse 
} from '../models';
import { environment } from '../../../environments/environment';

/**
 * Servicio para gestionar Tiritos
 * Acciones: Crear, Ver, Listar, Marcar en progreso, Cerrar
 * El backend SIEMPRE valida permisos y límites
 */
@Injectable({
  providedIn: 'root'
})
export class TiritosService {
  private readonly API_URL = `${environment.apiUrl}/tiritos`;

  constructor(private http: HttpClient) {}

  /**
   * Obtiene lista de tiritos con filtros opcionales
   */
  getTiritos(filters?: TiritoFilters): Observable<TiritosResponse> {
    let params = new HttpParams();
    
    if (filters) {
      if (filters.status) params = params.set('status', filters.status);
      if (filters.search) params = params.set('search', filters.search);
      if (filters.location) params = params.set('location', filters.location);
      if (filters.page) params = params.set('page', filters.page.toString());
      if (filters.limit) params = params.set('limit', filters.limit.toString());
    }

    return this.http.get<TiritosResponse>(this.API_URL, { params });
  }

  /**
   * Obtiene tiritos por creatorId (público)
   */
  getTiritosByCreator(creatorId: string, page = 1, limit = 12) {
    let params = new HttpParams().set('page', page.toString()).set('limit', limit.toString());
    return this.http.get<TiritosResponse>(`${this.API_URL}/creator/${creatorId}`, { params });
  }

  /**
   * Obtiene un tirito por ID
   */
  getTiritoById(id: string): Observable<Tirito> {
    return this.http.get<Tirito>(`${this.API_URL}/${id}`);
  }

  /**
   * Crea un nuevo tirito
   * Límite: 1 tirito activo por usuario (validado en backend)
   * Máximo 5 imágenes, 5MB por imagen
   */
  createTirito(data: CreateTiritoData): Observable<Tirito> {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('description', data.description);
    
    if (data.location) {
      formData.append('location', data.location);
    }

    if (data.images) {
      data.images.forEach((image, index) => {
        formData.append(`images`, image, image.name);
      });
    }

    return this.http.post<any>(this.API_URL, formData).pipe(
      map(res => res.tirito as Tirito)
    );
  }

  /**
   * Marca un tirito como "en progreso"
   * Si lo hace alguien distinto al creador, se asigna como "assignedTo"
   */
  markInProgress(id: string): Observable<Tirito> {
    return this.http.patch<any>(`${this.API_URL}/${id}/status`, {
      status: 'in_progress'
    }).pipe(
      map(res => res.tirito as Tirito)
    );
  }

  /**
   * Cierra un tirito
   * Solo el creador o el assignedTo pueden cerrarlo
   */
  closeTirito(id: string): Observable<Tirito> {
    return this.http.patch<any>(`${this.API_URL}/${id}/status`, {
      status: 'closed'
    }).pipe(
      map(res => res.tirito as Tirito)
    );
  }

  /**
   * Obtiene tiritos del usuario actual
   */
  getMyTiritos(): Observable<TiritosResponse> {
    return this.http.get<TiritosResponse>(`${this.API_URL}/me`);
  }

  /**
   * Verifica si el usuario puede crear un nuevo tirito
   * Retorna true si no tiene tiritos activos
   */
  canCreateTirito(): Observable<{ canCreate: boolean; message?: string }> {
    return this.http.get<{ canCreate: boolean; message?: string }>(
      `${this.API_URL}/can-create`
    );
  }
}
