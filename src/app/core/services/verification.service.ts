import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class VerificationService {
  private readonly API = `${environment.apiUrl}/verification`;

  constructor(private http: HttpClient) {}

  getStatus(): Observable<any> {
    return this.http.get(`${this.API}/status`);
  }

  submitDocuments(files: File[]): Observable<any> {
    const formData = new FormData();
    files.forEach(f => formData.append('documents', f));
    return this.http.post(`${this.API}/submit`, formData);
  }
}
