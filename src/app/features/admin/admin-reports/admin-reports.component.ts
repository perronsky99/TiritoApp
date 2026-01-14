import { Component, OnInit } from '@angular/core';
import { ReportService } from '../../../core/services/report.service';

@Component({
  selector: 'app-admin-reports',
  templateUrl: './admin-reports.component.html',
  styleUrls: ['./admin-reports.component.scss']
})
export class AdminReportsComponent implements OnInit {
  reports: any[] = [];
  loading = false;

  constructor(private reportService: ReportService) {}

  ngOnInit(): void {
    this.load();
  }

  load() {
    this.loading = true;
    this.reportService.listReports().subscribe({
      next: (res: any) => {
        this.reports = Array.isArray(res) ? res : (res.items || []);
        this.loading = false;
      },
      error: () => (this.loading = false)
    });
  }

  doBan(r: any) {
    const hours = parseInt(window.prompt('Duración en horas (ej: 168 = 7 días)', '168') || '168', 10) || 168;
    const reason = window.prompt('Razón para el baneo (ej: inappropriate_behavior)', 'inappropriate_behavior') || 'inappropriate_behavior';
    this.reportService.actionReport(r._id, { action: 'ban', durationHours: hours, reason }).subscribe({
      next: () => this.load(),
      error: (e) => alert('Error: ' + (e?.message || e))
    });
  }

  doUnban(r: any) {
    if (!confirm('Confirmar desbaneo?')) return;
    this.reportService.actionReport(r._id, { action: 'unban' }).subscribe({
      next: () => this.load(),
      error: (e) => alert('Error: ' + (e?.message || e))
    });
  }

  doBlock(r: any) {
    if (!confirm('Confirmar bloqueo de usuario (reporter action)?')) return;
    this.reportService.actionReport(r._id, { action: 'user_block' }).subscribe({
      next: () => this.load(),
      error: (e) => alert('Error: ' + (e?.message || e))
    });
  }
}
