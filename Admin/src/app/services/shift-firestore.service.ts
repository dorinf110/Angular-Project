import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Shift } from '../interfaces/shift';
import { NotifierService } from './notifier.service';


@Injectable({
  providedIn: 'root'
})
export class ShiftFirestoreService {

allShifts:{shift:Shift,shiftID:string}[];  
shiftRow:{shiftId:string, username:string, date:string, startTime:string, endTime:string, wage:number, place:string, profit:number};
userIdShifts:string='';

  constructor(public firestore:AngularFirestore, private notifier:NotifierService) { this.userIdShifts=''}

  public getShifts(){
     return this.firestore.collection('shifts').snapshotChanges();
  } 

  public  saveShift(shift:Shift){
     this.firestore.collection('shifts').add(shift).then(document=>{
      // console.log("user added:", document);
    }).catch(error=>{
      // console.log(error);
      this.notifier.showNotification(error,"OK","error","top");
    });
  }

  public  updateShift(id:string, shift:Shift){
    const document = this.firestore.collection('shifts').doc(id);
     document.update(shift).then(data=>{
      // console.log("Shift updated!",data);
    }).catch(error=>{
      // console.log(error);
      this.notifier.showNotification(error,"OK","error","top");
    });
  }

  public deleteShift(id:string){
    const document= this.firestore.collection('shifts').doc(id);
    document.delete().catch(error=>{
      console.log(error);
  })}

  public getAllShifts(){
    return this.allShifts;
  }

  public setAllShifts(value:{shift:Shift,shiftID:string}[]){
    this.allShifts=value;
  }
  public clickShiftRow(value:{shiftId:string, username:string, date:string, startTime:string, endTime:string, wage:number, place:string, profit:number}){
    this.shiftRow=value;
  }

  public getShiftRow(){
    return this.shiftRow;
  }

  public setUserIdShidfts(value:string){
    this.userIdShifts =value;
  }

  public getUserIdShifts(){
    return this.userIdShifts;
  }
}
