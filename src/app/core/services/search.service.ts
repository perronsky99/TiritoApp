import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class SearchService {
  private readonly API = `${environment.apiUrl.replace(/\/$/, '')}/tiritos`;

  constructor(private http: HttpClient) {}

  // simple search endpoint, uses existing backend `search` query param
  search(query: string, page = 1, limit = 6): Observable<any> {
    let params = new HttpParams().set('search', query).set('page', String(page)).set('limit', String(limit));
    return this.http.get<any>(this.API, { params });
  }
}
