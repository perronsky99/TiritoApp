import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export interface CedulaResult {
  firstName: string;
  lastName: string;
  id: string;
  fullName?: string;
  birthDate?: string; // ISO YYYY-MM-DD
  gender?: string; // 'M'|'F' or other
  raw?: any;
}

export interface CedulaLookupError {
  error: true;
  status?: number;
  message?: string;
}

@Injectable({ providedIn: 'root' })
export class CedulaLookupService {
  constructor(private http: HttpClient) {}

  /**
   * Intenta consultar un servicio externo para obtener datos asociados a una cédula.
   * NO garantiza veracidad; la UI deberá permitir edición y no bloquear el flujo.
   */
  lookup(docType: string, number: string): Observable<CedulaResult | CedulaLookupError | null> {
    if (!number) return of(null);
    const combined = `${docType}${number}`;
    const url = `/api/external/cedula/${encodeURIComponent(combined)}`;
    return this.http.get<any>(url).pipe(
      map((res: any) => (res ? (res as CedulaResult) : null)),
      catchError((err: any) => {
        // Map different failure modes into a predictable shape the UI can handle
        const status = err?.status;
        let message = 'No se pudo consultar el servicio de búsqueda de cédula.';
        if (status === 404) message = 'No se encontró información para esa cédula.';
        if (status === 429) message = 'Se alcanzó el límite de consultas. Intentá en unos minutos.';
        if (status === 503 || status === 502) message = 'Servicio temporalmente no disponible. Intentá más tarde.';
        if (err?.error?.message) message = err.error.message;
        const payload: CedulaLookupError = { error: true, status, message };
        return of(payload);
      })
    );
  }
}
