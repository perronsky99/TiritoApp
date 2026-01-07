import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface Rating {
  _id?: string;
  tiritoId: string;
  raterId: string;
  targetId: string;
  score: number;
  comment?: string;
  createdAt?: string;
}

@Injectable({ providedIn: 'root' })
export class RatingService {
  private readonly API = `${environment.apiUrl}/ratings`;

  constructor(private http: HttpClient) {}

  createRating(payload: { tiritoId: string; targetId: string; score: number; comment?: string }): Observable<any> {
    return this.http.post(this.API, payload);
  }

  getRatingsForUser(userId: string) {
    return this.http.get<{ data: Rating[] }>(`${this.API}/user/${userId}`).pipe(
      catchError(() => of({ data: [] }))
    );
  }

  getSummary(userId: string) {
    return this.http.get<{ avgScore: number; count: number }>(`${this.API}/summary/${userId}`).pipe(
      catchError(() => of({ avgScore: 0, count: 0 }))
    );
  }

  getPendingRatings() {
    return this.http.get<{ data: Array<any>; total: number }>(`${this.API}/pending`);
  }

  getRatingsForTirito(tiritoId: string) {
    return this.http.get<{
      tiritoId: string;
      isParticipant: boolean;
      isCreator: boolean;
      counterpartId: string | null;
      counterpartName: string | null;
      givenRating: { score: number; comment?: string; createdAt: string } | null;
      receivedRating: { score: number; comment?: string; createdAt: string } | null;
    }>(`${this.API}/tirito/${tiritoId}`);
  }

  requestRating(tiritoId: string) {
    return this.http.post<{ message: string }>(`${this.API}/request`, { tiritoId });
  }
}
