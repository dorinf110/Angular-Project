import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotifierComponent } from '../components/notifier/notifier.component';

@Injectable({
  providedIn: 'root'
})
export class NotifierService {

  constructor(private snackBar:MatSnackBar) { }

  showNotification(displayMessage:string, btnTxt:string, messageType:'error'|'success'|'warning',vp:'top'|'bottom'){
    this.snackBar.openFromComponent(NotifierComponent,{
      data: {
        message: displayMessage,
        btnTxt: btnTxt,
        type: messageType
      },
      duration:3000,
      horizontalPosition:'right',
      verticalPosition:vp,
      panelClass:messageType
    })
  }
}
