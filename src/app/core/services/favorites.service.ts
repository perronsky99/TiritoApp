import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class FavoritesService {
  private readonly API = `${environment.apiUrl}/users/me/favorites`;

  constructor(private http: HttpClient) {}

  getFavorites(page = 1, limit = 12): Observable<any> {
    let params = new HttpParams().set('page', page.toString()).set('limit', limit.toString());
    return this.http.get<any>(this.API, { params });
  }

  addFavorite(tiritoId: string) {
    return this.http.post<any>(`${this.API}/${tiritoId}`, {});
  }

  removeFavorite(tiritoId: string) {
    return this.http.delete<any>(`${this.API}/${tiritoId}`);
  }
}
