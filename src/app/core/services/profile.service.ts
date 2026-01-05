import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User, VerificationStatus } from '../models';
import { environment } from '../../../environments/environment';

/**
 * Servicio para gestión de perfiles
 */
@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private readonly API_URL = `${environment.apiUrl}/profiles`;

  constructor(private http: HttpClient) {}

  /**
   * Obtiene perfil público de un usuario
   */
  getProfile(userId: string): Observable<User> {
    return this.http.get<User>(`${this.API_URL}/${userId}`);
  }

  /**
   * Sube documento de verificación
   * - user/worker: documento de identidad
   * - business: documento fiscal
   */
  uploadVerificationDocument(document: File): Observable<{
    status: VerificationStatus;
    message: string;
  }> {
    const formData = new FormData();
    formData.append('document', document, document.name);

    return this.http.post<{ status: VerificationStatus; message: string }>(
      `${this.API_URL}/verification`,
      formData
    );
  }

  /**
   * Obtiene el estado de verificación actual
   */
  getVerificationStatus(): Observable<{
    status: VerificationStatus;
    message?: string;
  }> {
    return this.http.get<{ status: VerificationStatus; message?: string }>(
      `${this.API_URL}/verification/status`
    );
  }
}
