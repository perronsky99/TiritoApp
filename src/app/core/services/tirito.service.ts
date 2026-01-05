import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface ITirito {
  id: string;
  title: string;
  description: string;
  images: string[];
  status: 'open' | 'in_progress' | 'closed';
  createdBy: string;
  createdAt: string;
}

@Injectable({ providedIn: 'root' })
export class TiritoService {
  private readonly API = environment.apiUrl + '/tiritos';

  constructor(private http: HttpClient) {}

  listar(): Observable<{ tiritos: ITirito[] }> {
    return this.http.get<{ tiritos: ITirito[] }>(`${this.API}`);
  }

  obtenerDetalle(id: string): Observable<{ tirito: ITirito }> {
    return this.http.get<{ tirito: ITirito }>(`${this.API}/${id}`);
  }

  crear(data: FormData): Observable<any> {
    return this.http.post<any>(`${this.API}`, data);
  }

  cambiarEstado(id: string, status: 'open' | 'in_progress' | 'closed'): Observable<any> {
    return this.http.patch<any>(`${this.API}/${id}/status`, { status });
  }

  misTiritos(): Observable<{ tiritos: ITirito[] }> {
    return this.http.get<{ tiritos: ITirito[] }>(`${this.API}/my`);
  }
}
