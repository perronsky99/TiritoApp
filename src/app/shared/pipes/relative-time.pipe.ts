import { Pipe, PipeTransform } from '@angular/core';

/**
 * Pipe para formatear fechas de forma relativa
 * Ej: "hace 5 minutos", "hace 2 horas", "ayer"
 */
@Pipe({
  name: 'relativeTime'
})
export class RelativeTimePipe implements PipeTransform {
  transform(value: string | Date): string {
    if (!value) return '';
    
    const date = new Date(value);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) {
      return 'hace un momento';
    }
    
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return diffInMinutes === 1 
        ? 'hace 1 minuto' 
        : `hace ${diffInMinutes} minutos`;
    }
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return diffInHours === 1 
        ? 'hace 1 hora' 
        : `hace ${diffInHours} horas`;
    }
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) {
      return 'ayer';
    }
    if (diffInDays < 7) {
      return `hace ${diffInDays} días`;
    }
    
    const diffInWeeks = Math.floor(diffInDays / 7);
    if (diffInWeeks < 4) {
      return diffInWeeks === 1 
        ? 'hace 1 semana' 
        : `hace ${diffInWeeks} semanas`;
    }
    
    // Más de un mes, mostrar fecha
    return date.toLocaleDateString('es-AR', {
      day: 'numeric',
      month: 'short',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  }
}
