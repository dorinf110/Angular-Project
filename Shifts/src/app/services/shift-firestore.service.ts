import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Shift } from '../interfaces/shift';
import { NotifierService } from './notifier.service';


@Injectable({
  providedIn: 'root'
})
export class ShiftFirestoreService {

userShifts:{shift:Shift,shiftID:string}[];
clickedRow:{shiftId:string,date:string, startTime:string, endTime:string, wage:number, place:string, profit:number};

  constructor(public firestore:AngularFirestore, private notifier:NotifierService) { }

  public getShifts(){
    return this.firestore.collection('shifts').snapshotChanges();
  } 

  public saveShift(shift:Shift){
    this.firestore.collection('shifts').add(shift).then(document=>{
      // console.log("user added:", document);
    }).catch(error=>{
      // console.log(error);
      this.notifier.showNotification(error,"OK","error","top");
    });
  }

  public updateShift(id:string, shift:Shift){
    const document = this.firestore.collection('shifts').doc(id);
    document.update(shift).then(data=>{
      // console.log("Shift updated!",data);
    }).catch(error=>{
      // console.log(error);
      this.notifier.showNotification(error,"OK","error","top");
    });
  }

  public setUserShifts(value:{shift:Shift,shiftID:string}[]){
    this.userShifts=value;
  }

  public getUserShifts(){
    return this.userShifts;
  }

  public setClickedRow(value:{shiftId:string,date:string, startTime:string, endTime:string, wage:number, place:string, profit:number}){
    this.clickedRow=value;
  }

  public getClickedRow(){
    return this.clickedRow;
  }
}
