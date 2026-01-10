import { Component, ElementRef, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subscription, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, switchMap, catchError } from 'rxjs/operators';
import { SearchService } from '../../services/search.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss']
})
export class SearchBarComponent implements OnInit, OnDestroy {
  @Output() search = new EventEmitter<string>();
  control = new FormControl('');
  suggestions: any[] = [];
  loading = false;
  private sub?: Subscription;
  @ViewChild('input') input?: ElementRef<HTMLInputElement>;

  constructor(private searchService: SearchService, private router: Router) {}

  ngOnInit(): void {
    this.sub = this.control.valueChanges.pipe(
      debounceTime(250),
      distinctUntilChanged(),
      filter(v => typeof v === 'string' && v.trim().length > 0),
      switchMap(q => {
        this.loading = true;
        return this.searchService.search(q, 1, 6).pipe(catchError(() => of({ data: [] })));
      })
    ).subscribe((res: any) => {
      this.loading = false;
      this.suggestions = (res && res.data) ? res.data : (res.favorites || res.items || []);
    });
  }

  ngOnDestroy(): void { if (this.sub) this.sub.unsubscribe(); }

  onSelect(item: any): void {
    // navigate to tirito detail
    const id = item.id || item._id;
    if (id) this.router.navigate(['/tiritos', id]);
    this.clear();
  }

  onSubmit(): void {
    const q = (this.control.value || '').trim();
    if (!q) return;
    this.router.navigate(['/tiritos'], { queryParams: { search: q } });
    this.clear();
  }

  clear(): void { this.control.setValue(''); this.suggestions = []; }
}
