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

@Injectable({ providedIn: 'root' })
export class CedulaLookupService {
  constructor(private http: HttpClient) {}

  /**
   * Intenta consultar un servicio externo para obtener datos asociados a una cédula.
   * NO garantiza veracidad; la UI deberá permitir edición y no bloquear el flujo.
   */
  lookup(docType: string, number: string): Observable<CedulaResult | null> {
    if (!number) return of(null);
    const combined = `${docType}${number}`;
    const url = `/api/external/cedula/${encodeURIComponent(combined)}`;
    return this.http.get<CedulaResult | null>(url).pipe(
      catchError(() => of(null))
    );
  }
}
