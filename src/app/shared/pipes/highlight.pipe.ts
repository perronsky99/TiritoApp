import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({ name: 'highlight' })
export class HighlightPipe implements PipeTransform {

  constructor(private sanitizer: DomSanitizer) {}

  transform(text: string, query: string): SafeHtml {
    if (!text) return '';
    const escaped = this.escapeHtml(text);
    if (!query || !query.trim()) {
      return this.sanitizer.bypassSecurityTrustHtml(escaped);
    }
    const q = this.escapeRegExp(query.trim());
    const highlighted = escaped.replace(new RegExp(`(${q})`, 'gi'), '<mark>$1</mark>');
    return this.sanitizer.bypassSecurityTrustHtml(highlighted);
  }

  private escapeHtml(str: string): string {
    return (str || '').replace(/[&<>"']/g, s =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' } as any)[s]
    );
  }

  private escapeRegExp(s: string): string {
    return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
}
