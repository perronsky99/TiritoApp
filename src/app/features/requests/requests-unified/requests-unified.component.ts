import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TiritoRequestsService, TiritoRequest } from '../../../core/services/tirito-requests.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-requests-unified',
  templateUrl: './requests-unified.component.html',
  styleUrls: ['./requests-unified.component.scss']
})
export class RequestsUnifiedComponent implements OnInit {
  // Tab actual (0 = recibidas, 1 = enviadas)
  selectedTabIndex = 0;

  // Solicitudes recibidas (como creador)
  receivedRequests: TiritoRequest[] = [];
  loadingReceived = true;
  errorReceived: string | null = null;

  // Solicitudes enviadas (como solicitante)
  sentRequests: TiritoRequest[] = [];
  loadingSent = true;
  errorSent: string | null = null;

  // Track de solicitudes en proceso (para loading individual)
  processingRequests: Set<string> = new Set();

  constructor(
    private requestsService: TiritoRequestsService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    // Verificar si hay un tab específico en la URL
    const tab = this.route.snapshot.queryParamMap.get('tab');
    if (tab === 'enviadas') {
      this.selectedTabIndex = 1;
    }

    this.loadReceivedRequests();
    this.loadSentRequests();
  }

  onTabChange(index: number): void {
    this.selectedTabIndex = index;
    // Actualizar URL sin recargar
    const tab = index === 1 ? 'enviadas' : 'recibidas';
    this.router.navigate([], { 
      relativeTo: this.route,
      queryParams: { tab },
      queryParamsHandling: 'merge'
    });
  }

  // === SOLICITUDES RECIBIDAS ===
  loadReceivedRequests(): void {
    this.loadingReceived = true;
    this.errorReceived = null;
    this.requestsService.getMyRequests().subscribe({
      next: (res) => {
        this.receivedRequests = res.data;
        this.loadingReceived = false;
      },
      error: () => {
        this.errorReceived = 'Error al cargar solicitudes recibidas';
        this.loadingReceived = false;
      }
    });
  }

  viewProfile(requesterId: string): void {
    this.router.navigate(['/perfil', requesterId]);
  }

  viewTirito(tiritoId: string): void {
    this.router.navigate(['/tiritos', tiritoId]);
  }

  openChat(tiritoId: string, requesterId: string): void {
    this.router.navigate(['/chat', tiritoId], { queryParams: { withUser: requesterId } });
  }

  acceptRequest(request: TiritoRequest): void {
    this.processingRequests.add(request.id);
    this.requestsService.acceptRequest(request.id).subscribe({
      next: () => {
        this.processingRequests.delete(request.id);
        // Actualizar el estado localmente sin recargar todo
        request.status = 'accepted';
        this.snackBar.open('¡Solicitud aceptada! El usuario puede comenzar a trabajar.', 'Cerrar', { duration: 3000 });
      },
      error: (err) => {
        this.processingRequests.delete(request.id);
        this.snackBar.open(err.error?.message || 'Error al aceptar', 'Cerrar', { duration: 3000 });
      }
    });
  }

  rejectRequest(request: TiritoRequest): void {
    this.processingRequests.add(request.id);
    this.requestsService.rejectRequest(request.id).subscribe({
      next: () => {
        this.processingRequests.delete(request.id);
        // Actualizar el estado localmente sin recargar todo
        request.status = 'rejected';
        this.snackBar.open('Solicitud rechazada', 'Cerrar', { duration: 3000 });
      },
      error: (err) => {
        this.processingRequests.delete(request.id);
        this.snackBar.open(err.error?.message || 'Error al rechazar', 'Cerrar', { duration: 3000 });
      }
    });
  }

  isProcessing(requestId: string): boolean {
    return this.processingRequests.has(requestId);
  }

  // === SOLICITUDES ENVIADAS ===
  loadSentRequests(): void {
    this.loadingSent = true;
    this.errorSent = null;
    this.requestsService.getMySentRequests().subscribe({
      next: (res) => {
        this.sentRequests = res.data;
        this.loadingSent = false;
      },
      error: () => {
        this.errorSent = 'Error al cargar tus solicitudes';
        this.loadingSent = false;
      }
    });
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'pending': return 'Pendiente';
      case 'accepted': return 'Aceptada';
      case 'rejected': return 'Rechazada';
      default: return status;
    }
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'pending': return 'status-pending';
      case 'accepted': return 'status-accepted';
      case 'rejected': return 'status-rejected';
      default: return '';
    }
  }

  // Contadores para los badges
  get receivedCount(): number {
    return this.receivedRequests.length;
  }

  get sentCount(): number {
    return this.sentRequests.length;
  }
}
