import { Component, Input, Output, EventEmitter, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

/**
 * Componente para upload de imágenes
 * Máximo 5 imágenes, 5MB por imagen
 */
@Component({
  selector: 'app-image-upload',
  template: `
    <div class="image-upload-container">
      <div class="images-preview" *ngIf="images.length > 0">
        <div 
          class="image-item" 
          *ngFor="let image of images; let i = index">
          <img [src]="imagePreviews.get(image)" alt="Preview">
          <button 
            mat-icon-button 
            class="remove-btn"
            (click)="removeImage(i)">
            <mat-icon>close</mat-icon>
          </button>
        </div>
      </div>
      
      <div 
        class="upload-area" 
        *ngIf="images.length < maxImages"
        (click)="fileInput.click()"
        (dragover)="onDragOver($event)"
        (drop)="onDrop($event)">
        <mat-icon>add_photo_alternate</mat-icon>
        <span>Agregar imagen</span>
        <span class="hint">{{ images.length }}/{{ maxImages }} · Máx {{ maxSizeMB }}MB</span>
      </div>
      
      <input 
        #fileInput
        type="file"
        accept="image/*"
        multiple
        hidden
        (change)="onFileSelected($event)">
      
      <mat-error *ngIf="error">{{ error }}</mat-error>
    </div>
  `,
  styles: [`
    .image-upload-container {
      width: 100%;
    }
    .images-preview {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-bottom: 8px;
    }
    .image-item {
      position: relative;
      width: 80px;
      height: 80px;
      border-radius: 8px;
      overflow: hidden;
    }
    .image-item img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .remove-btn {
      position: absolute;
      top: 2px;
      right: 2px;
      width: 24px !important;
      height: 24px !important;
      background: rgba(0,0,0,0.5);
      color: white;
    }
    .remove-btn mat-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
    }
    .upload-area {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 20px;
      border: 2px dashed #ccc;
      border-radius: 8px;
      cursor: pointer;
      transition: border-color 0.2s;
    }
    .upload-area:hover {
      border-color: #7b1fa2;
    }
    .upload-area mat-icon {
      font-size: 32px;
      width: 32px;
      height: 32px;
      color: #7b1fa2;
    }
    .upload-area span {
      color: #666;
      margin-top: 4px;
    }
    .hint {
      font-size: 12px;
      color: #999;
    }
  `]
})
export class ImageUploadComponent implements OnDestroy {
  @Input() images: File[] = [];
  @Input() maxImages = 5;
  @Input() maxSizeMB = 5;
  @Output() imagesChange = new EventEmitter<File[]>();
  
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  
  error: string | null = null;
  
  // Cache de URLs sanitizadas para evitar crear nuevas en cada detección de cambios
  imagePreviews = new Map<File, SafeUrl>();
  private objectUrls: string[] = [];

  constructor(private sanitizer: DomSanitizer) {}

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.addFiles(Array.from(input.files));
    }
    // Reset input para permitir seleccionar el mismo archivo
    input.value = '';
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    
    if (event.dataTransfer?.files) {
      this.addFiles(Array.from(event.dataTransfer.files));
    }
  }

  private addFiles(files: File[]): void {
    this.error = null;
    
    for (const file of files) {
      if (this.images.length >= this.maxImages) {
        this.error = `Máximo ${this.maxImages} imágenes`;
        break;
      }
      
      if (!file.type.startsWith('image/')) {
        this.error = 'Solo se permiten imágenes';
        continue;
      }
      
      if (file.size > this.maxSizeMB * 1024 * 1024) {
        this.error = `La imagen supera los ${this.maxSizeMB}MB`;
        continue;
      }
      
      this.images.push(file);
      // Crear y cachear la URL sanitizada
      this.createImagePreview(file);
    }
    
    this.imagesChange.emit(this.images);
  }

  removeImage(index: number): void {
    const file = this.images[index];
    this.images.splice(index, 1);
    // Limpiar el preview del archivo eliminado
    this.imagePreviews.delete(file);
    this.imagesChange.emit(this.images);
    this.error = null;
  }

  private createImagePreview(file: File): void {
    const url = URL.createObjectURL(file);
    this.objectUrls.push(url);
    const safeUrl = this.sanitizer.bypassSecurityTrustUrl(url);
    this.imagePreviews.set(file, safeUrl);
  }

  ngOnDestroy(): void {
    // Liberar todas las URLs de objeto al destruir el componente
    this.objectUrls.forEach(url => URL.revokeObjectURL(url));
    this.imagePreviews.clear();
  }
}
