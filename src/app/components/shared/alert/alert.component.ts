import { Component, Inject, Output } from '@angular/core';
import {DIALOG_DATA, DialogModule, DialogRef} from '@angular/cdk/dialog';

@Component({
  selector: 'app-alert',
  standalone: true,
  imports: [
    DialogModule
  ],
  templateUrl: './alert.component.html',
  styleUrl: './alert.component.scss'
})
export class AlertComponent {

  constructor(public dialogRef: DialogRef<any> ,@Inject(DIALOG_DATA) public data: AlertData) {
    if(!data.truthyButtonLabel && !data.falsyButtonLabel) {
      setTimeout(() => {
        this.dialogRef.close();
      }, 1000);
    }

  }

  onTruthyButtonClicked() {
    this.dialogRef.close(true);
  }

  onFalsyButtonClicked() {
    this.dialogRef.close(false);
  }

}

export interface AlertData {
  title?: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  truthyButtonLabel?: string;
  falsyButtonLabel?: string;
}
