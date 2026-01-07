import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface RatingDialogData {
  tiritoId: string;
  targetId: string;
  targetName?: string;
}

@Component({
  selector: 'app-rating-dialog',
  templateUrl: './rating-dialog.component.html',
  styleUrls: ['./rating-dialog.component.scss']
})
export class RatingDialogComponent {
  score = 5;
  comment = '';
  submitting = false;

  constructor(
    public dialogRef: MatDialogRef<RatingDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: RatingDialogData
  ) {}

  setScore(s: number) { this.score = s; }

  cancel() { this.dialogRef.close(); }

  submit() {
    this.submitting = true;
    // Return the draft to the opener; actual POST is handled by opener
    this.dialogRef.close({ score: this.score, comment: this.comment });
  }
}
