import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-dialog-delete-all',
  templateUrl: './confirm-dialog-delete-all.component.html',
  styleUrls: ['./confirm-dialog-delete-all.component.css']
})
export class ConfirmDialogDeleteAllComponent {
  constructor(public dialogRef: MatDialogRef<ConfirmDialogDeleteAllComponent>) {}

  onConfirm(): void {
    this.dialogRef.close(true);
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
