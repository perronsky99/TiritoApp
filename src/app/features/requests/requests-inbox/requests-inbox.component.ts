import { Component, OnInit } from '@angular/core';
import { TiritoRequestsService, TiritoRequest } from '../../../core/services/tirito-requests.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-requests-inbox',
  templateUrl: './requests-inbox.component.html',
  styleUrls: ['./requests-inbox.component.scss']
})
export class RequestsInboxComponent implements OnInit {
  requests: TiritoRequest[] = [];
  loading = true;
  error: string | null = null;

  constructor(
    private requestsService: TiritoRequestsService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadRequests();
  }

  loadRequests(): void {
    this.loading = true;
    this.requestsService.getMyRequests().subscribe({
      next: (res) => {
        this.requests = res.data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar solicitudes';
        this.loading = false;
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
    // Navegar al chat con el parámetro withUser para especificar con quién chatear
    this.router.navigate(['/chat', tiritoId], { queryParams: { withUser: requesterId } });
  }

  acceptRequest(request: TiritoRequest): void {
    this.requestsService.acceptRequest(request.id).subscribe({
      next: () => {
        this.snackBar.open('¡Solicitud aceptada! El usuario puede comenzar a trabajar.', 'Cerrar', { duration: 3000 });
        this.loadRequests();
      },
      error: (err) => {
        this.snackBar.open(err.error?.message || 'Error al aceptar', 'Cerrar', { duration: 3000 });
      }
    });
  }

  rejectRequest(request: TiritoRequest): void {
    this.requestsService.rejectRequest(request.id).subscribe({
      next: () => {
        this.snackBar.open('Solicitud rechazada', 'Cerrar', { duration: 3000 });
        this.loadRequests();
      },
      error: (err) => {
        this.snackBar.open(err.error?.message || 'Error al rechazar', 'Cerrar', { duration: 3000 });
      }
    });
  }
}
