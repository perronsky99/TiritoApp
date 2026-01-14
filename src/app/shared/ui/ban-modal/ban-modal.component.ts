import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

const BAN_REASONS = [
  { value: 'inappropriate_behavior', label: 'Comportamiento inapropiado' },
  { value: 'sustained_abuse', label: 'Abuso sostenido' },
  { value: 'suspected_fraud', label: 'Sospecha de fraude' },
  { value: 'other', label: 'Otro' }
];

@Component({
  selector: 'app-ban-modal',
  templateUrl: './ban-modal.component.html',
  styleUrls: ['./ban-modal.component.scss']
})
export class BanModalComponent {
  form: FormGroup;
  reasons = BAN_REASONS;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<BanModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { report: any }
  ) {
    this.form = this.fb.group({
      permanent: [false],
      durationHours: [168, [Validators.min(1)]],
      reason: [this.reasons[0].value, Validators.required],
      note: ['']
    });
  }

  submit() {
    if (this.form.invalid) return;
    const v = this.form.value;
    const payload: any = { reason: v.reason };
    if (!v.permanent) payload.durationHours = v.durationHours;
    if (v.note) payload.note = v.note;
    this.dialogRef.close({ success: true, payload });
  }

  cancel() {
    this.dialogRef.close({ success: false });
  }
}
