import { Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";

@Component({
  templateUrl: "./error.component.html",
  selector: "app-error",
})
export class ErrorComponent {

  constructor(private dialogRef: MatDialogRef<ErrorComponent>, @Inject(MAT_DIALOG_DATA) public data: { message: string }) { }
  close() {
    this.dialogRef.close();
  }
}
