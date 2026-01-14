import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReportService } from '../../../core/services/report.service';

const REASONS = [
  { value: 'inappropriate_behavior', label: 'Comportamiento inapropiado' },
  { value: 'suspected_fraud', label: 'Sospecha de fraude' },
  { value: 'vulgar_language', label: 'Lenguaje vulgar' },
  { value: 'harassment', label: 'Acoso / Hostigamiento' },
  { value: 'spam', label: 'Spam / Publicidad' },
  { value: 'impersonation', label: 'Suplantación de identidad' },
  { value: 'other', label: 'Otro' }
];

@Component({
  selector: 'app-report-modal',
  templateUrl: './report-modal.component.html',
  styleUrls: ['./report-modal.component.scss']
})
export class ReportModalComponent {
  form: FormGroup;
  reasons = REASONS;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private reportService: ReportService,
    private dialogRef: MatDialogRef<ReportModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { targetId: string }
  ) {
    this.form = this.fb.group({
      category: [null, Validators.required],
      description: ['']
    });
  }

  submit() {
    if (this.form.invalid) return;
    this.loading = true;
    const payload = {
      targetId: this.data.targetId,
      category: this.form.value.category,
      description: this.form.value.description
    };
    this.reportService.createReport(payload).subscribe({
      next: (res) => {
        this.loading = false;
        this.dialogRef.close({ success: true, res });
      },
      error: (err) => {
        this.loading = false;
        this.dialogRef.close({ success: false, err });
      }
    });
  }

  cancel() {
    this.dialogRef.close({ success: false });
  }
}
