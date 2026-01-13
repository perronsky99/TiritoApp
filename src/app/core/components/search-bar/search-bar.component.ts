import { Component, ElementRef, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subscription, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, switchMap, catchError } from 'rxjs/operators';
import { SearchService } from '../../services/search.service';
import { Router } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

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
  activeIndex = -1;
  query = '';
  // generate ids for aria
  private idPrefix = 'search-sugg-';
  @ViewChild('input') input?: ElementRef<HTMLInputElement>;
  isExpanded = false;
  private suppressBlur = false;

  constructor(private searchService: SearchService, private router: Router, private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    this.sub = this.control.valueChanges.pipe(
      debounceTime(250),
      distinctUntilChanged(),
      filter(v => typeof v === 'string'),
      switchMap(q => {
        const trimmed = (q || '').trim();
        this.query = trimmed;
        if (!trimmed) {
          this.suggestions = [];
          this.loading = false;
          return of({ data: [] });
        }
        this.loading = true;
        return this.searchService.search(trimmed, 1, 6).pipe(catchError(() => of({ data: [] })));
      })
    ).subscribe((res: any) => {
      this.loading = false;
      this.suggestions = (res && res.data) ? res.data : (res.favorites || res.items || []);
      this.activeIndex = this.suggestions.length ? 0 : -1;
      // expand search if there are suggestions (mobile UX)
      if (this.suggestions && this.suggestions.length > 0) {
        this.isExpanded = true;
      }
    });
  }

  ngOnDestroy(): void { if (this.sub) this.sub.unsubscribe(); }

  onSelect(item: any): void {
    // navigate to tirito detail
    const id = item.id || item._id;
    if (id) this.router.navigate(['/tiritos', id]);
    this.clear();
    this.isExpanded = false;
  }

  onSubmit(): void {
    const q = (this.control.value || '').trim();
    if (!q) return;
    this.router.navigate(['/tiritos'], { queryParams: { search: q } });
    this.clear();
  }

  clear(): void { this.control.setValue(''); this.suggestions = []; }

  // keyboard handling
  onKeydown(event: KeyboardEvent): void {
    if (!this.suggestions || this.suggestions.length === 0) return;
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      this.activeIndex = Math.min(this.suggestions.length - 1, this.activeIndex + 1);
      this.scrollToActive();
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      this.activeIndex = Math.max(0, this.activeIndex - 1);
      this.scrollToActive();
    } else if (event.key === 'Enter') {
      if (this.activeIndex >= 0 && this.activeIndex < this.suggestions.length) {
        event.preventDefault();
        this.onSelect(this.suggestions[this.activeIndex]);
      } else {
        this.onSubmit();
      }
    } else if (event.key === 'Escape') {
      this.clear();
      if (this.input && this.input.nativeElement) this.input.nativeElement.blur();
    }
  }

  onFocus(): void {
    this.isExpanded = true;
  }

  onBlur(): void {
    // allow click on suggestions to proceed without collapsing
    setTimeout(() => {
      if (!this.suppressBlur && (!this.suggestions || this.suggestions.length === 0)) {
        this.isExpanded = false;
      }
      this.suppressBlur = false;
    }, 120);
  }

  onSuggestionMouseDown(): void { this.suppressBlur = true; }
  onSuggestionMouseUp(): void { setTimeout(() => { this.suppressBlur = false; }, 50); }

  private scrollToActive(): void {
    // ensure active suggestion is visible - basic approach
    const el = document.getElementById(this.idPrefix + this.activeIndex);
    if (el && el.scrollIntoView) el.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }

  // highlight matches in title safely
  highlight(text: string): SafeHtml {
    if (!text || !this.query) return this.sanitizer.bypassSecurityTrustHtml(this.escapeHtml(text));
    const q = this.escapeRegExp(this.query);
    const highlighted = text.replace(new RegExp(`(${q})`, 'ig'), '<mark>$1</mark>');
    return this.sanitizer.bypassSecurityTrustHtml(highlighted);
  }

  private escapeHtml(str: string): string {
    return (str || '').replace(/[&<>\":']/g, s => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;"} as any)[s]);
  }

  private escapeRegExp(s: string): string { return s.replace(/[.*+?^${}()|[\\]\\]/g, '\\$&'); }
}
