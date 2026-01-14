import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../../core/services/admin.service';

@Component({
  selector: 'app-admin-audits',
  templateUrl: './admin-audits.component.html',
  styleUrls: ['./admin-audits.component.scss']
})
export class AdminAuditsComponent implements OnInit {
  audits: any[] = [];
  loading = false;
  // filter fields
  filterActor = '';
  filterTarget = '';
  filterAction = '';
  filterFrom: string | null = null;
  filterTo: string | null = null;

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.adminService.listAudits().subscribe({
      next: (res: any) => {
        // backend returns either an array or an object with items
        this.audits = Array.isArray(res) ? res : (res.items || []);
        this.loading = false;
      },
      error: () => (this.loading = false)
    });
  }

  applyFilters() {
    const filters: any = {};
    if (this.filterActor) filters.actor = this.filterActor;
    if (this.filterTarget) filters.targetUser = this.filterTarget;
    if (this.filterAction) filters.action = this.filterAction;
    if (this.filterFrom) filters.from = this.filterFrom;
    if (this.filterTo) filters.to = this.filterTo;

    this.loading = true;
    this.adminService.listAudits(filters).subscribe({
      next: (res: any) => {
        this.audits = Array.isArray(res) ? res : (res.items || []);
        this.loading = false;
      },
      error: () => (this.loading = false)
    });
  }

  clearFilters() {
    this.filterActor = '';
    this.filterTarget = '';
    this.filterAction = '';
    this.filterFrom = null;
    this.filterTo = null;
    this.load();
  }
}
