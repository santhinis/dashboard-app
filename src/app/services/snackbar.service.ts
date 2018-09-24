import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';
@Injectable()
export class SnackbarService {
  constructor(public snackBar: MatSnackBar) { }
  
  openSnackBar(message,action) {
    this.snackBar.open(message,action='Dismiss',{
      duration: 500,
      verticalPosition: 'top',
      panelClass: 'snackbar'
    });
  }
}