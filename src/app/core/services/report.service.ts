import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ReportService {
  constructor(private http: HttpClient) { }

  createReport(payload: { targetId: string; category: string; description?: string; evidence?: string[] }): Observable<any> {
    return this.http.post('/api/reports', payload);
  }

  listReports(): Observable<any> {
    return this.http.get('/api/reports');
  }

  actionReport(reportId: string, payload: any): Observable<any> {
    return this.http.post(`/api/reports/${reportId}/action`, payload);
  }
}
