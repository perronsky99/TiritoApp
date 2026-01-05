import { Pipe, PipeTransform } from '@angular/core';

/**
 * Pipe para truncar texto con ellipsis
 */
@Pipe({
  name: 'truncate'
})
export class TruncatePipe implements PipeTransform {
  transform(value: string, limit: number = 100, ellipsis: string = '...'): string {
    if (!value) return '';
    if (value.length <= limit) return value;
    
    return value.substring(0, limit).trim() + ellipsis;
  }
}
