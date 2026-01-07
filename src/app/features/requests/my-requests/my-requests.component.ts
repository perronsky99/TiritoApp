import { Component, OnInit } from '@angular/core';
import { TiritoRequestsService, TiritoRequest } from '../../../core/services/tirito-requests.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-my-requests',
  templateUrl: './my-requests.component.html',
  styleUrls: ['./my-requests.component.scss']
})
export class MyRequestsComponent implements OnInit {
  requests: TiritoRequest[] = [];
  loading = true;
  error: string | null = null;

  constructor(
    private requestsService: TiritoRequestsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadRequests();
  }

  loadRequests(): void {
    this.loading = true;
    this.requestsService.getMySentRequests().subscribe({
      next: (res) => {
        this.requests = res.data;
        this.loading = false;
      },
      error: () => {
        this.error = 'Error al cargar tus solicitudes';
        this.loading = false;
      }
    });
  }

  viewTirito(tiritoId: string): void {
    this.router.navigate(['/tiritos', tiritoId]);
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
}
