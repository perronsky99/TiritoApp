import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class FavoritesStateService {
  private changes = new Subject<void>();

  notifyChange(): void {
    this.changes.next();
  }

  onChange(): Observable<void> {
    return this.changes.asObservable();
  }
}
