import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap, shareReplay, finalize } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class SearchService {
  private readonly API = `${environment.apiUrl.replace(/\/$/, '')}/tiritos`;
  private cache = new Map<string, any>();
  private inFlight = new Map<string, Observable<any>>();
  private MAX_CACHE = 50;

  constructor(private http: HttpClient) {}

  // simple search endpoint, uses existing backend `search` query param
  search(query: string, page = 1, limit = 6): Observable<any> {
    const q = (query || '').trim();
    const key = `${q}::${page}::${limit}`;
    if (this.cache.has(key)) {
      return of(this.cache.get(key));
    }
    if (this.inFlight.has(key)) {
      return this.inFlight.get(key) as Observable<any>;
    }

    let params = new HttpParams().set('search', q).set('page', String(page)).set('limit', String(limit));
    const obs = this.http.get<any>(this.API, { params }).pipe(
      tap(res => {
        // populate cache (simple LRU behaviour: delete oldest when limit reached)
        if (this.cache.size >= this.MAX_CACHE) {
          const first = this.cache.keys().next().value;
          this.cache.delete(first);
        }
        this.cache.set(key, res);
      }),
      shareReplay(1),
      finalize(() => this.inFlight.delete(key))
    );
    this.inFlight.set(key, obs);
    return obs;
  }
}
