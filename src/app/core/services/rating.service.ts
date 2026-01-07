import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

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
    return this.http.get<{ data: Rating[] }>(`${this.API}/user/${userId}`);
  }

  getSummary(userId: string) {
    return this.http.get<{ avgScore: number; count: number }>(`${this.API}/summary/${userId}`);
  }
}
