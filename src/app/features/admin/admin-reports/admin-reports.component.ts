import { Component, OnInit } from '@angular/core';
import { ReportService } from '../../../core/services/report.service';
import { MatDialog } from '@angular/material/dialog';
import { BanModalComponent } from '../../../shared/ui/ban-modal/ban-modal.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-admin-reports',
  templateUrl: './admin-reports.component.html',
  styleUrls: ['./admin-reports.component.scss']
})
export class AdminReportsComponent implements OnInit {
  reports: any[] = [];
  loading = false;

  constructor(private reportService: ReportService, private dialog: MatDialog, private snackBar: MatSnackBar) {}

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
    const dialogRef = this.dialog.open(BanModalComponent, { data: { report: r } });
    dialogRef.afterClosed().subscribe(result => {
      if (!result?.success) return;
      const payload = Object.assign({ action: 'ban' }, result.payload);
      this.reportService.actionReport(r._id, payload).subscribe({
        next: () => {
          this.snackBar.open('Usuario baneado correctamente', 'Cerrar', { duration: 3000 });
          this.load();
        },
        error: (e) => this.snackBar.open('Error: ' + (e?.message || e), 'Cerrar', { duration: 4000 })
      });
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
