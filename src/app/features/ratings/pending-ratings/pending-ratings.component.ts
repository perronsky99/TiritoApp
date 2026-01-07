import { Component, OnInit } from '@angular/core';
import { RatingService } from '../../../core/services/rating.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pending-ratings',
  templateUrl: './pending-ratings.component.html',
  styleUrls: ['./pending-ratings.component.scss']
})
export class PendingRatingsComponent implements OnInit {
  pending: any[] = [];
  loading = true;
  error: string | null = null;

  constructor(private ratingService: RatingService, private router: Router) {}

  ngOnInit(): void {
    this.loadPending();
  }

  loadPending(): void {
    this.loading = true;
    this.ratingService.getPendingRatings().subscribe({
      next: (res) => {
        this.pending = res.data || [];
        this.loading = false;
      },
      error: () => {
        this.error = 'No pudimos cargar las valoraciones pendientes';
        this.loading = false;
      }
    });
  }

  goToTirito(tiritoId: string): void {
    this.router.navigate(['/tiritos', tiritoId]);
  }
}
