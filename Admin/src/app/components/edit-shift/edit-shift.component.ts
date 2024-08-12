import { Component, OnInit } from '@angular/core';
import { ShiftFirestoreService } from 'src/app/services/shift-firestore.service';
import { FormGroup, FormControl, Validators, } from '@angular/forms';
import { Shift } from 'src/app/interfaces/shift';
import { NotifierService } from 'src/app/services/notifier.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-shift',
  templateUrl: './edit-shift.component.html',
  styleUrls: ['./edit-shift.component.css']
})

export class EditShiftComponent implements OnInit{
  clickedRow:{shiftId:string,username:string,date:string, startTime:string, endTime:string, wage:number, place:string, profit:number};
  
  constructor(private shiftServ:ShiftFirestoreService, private notifier:NotifierService, private router:Router){}
  Shifts:any[];
  ShiftsStr:string;
  clickedRowId:string;
  showSpinner:boolean=false;
  shiftToEdit:Shift;
  


  editShiftForm=new FormGroup({
    username: new FormControl(''),
    date: new FormControl(new Date("2023,11,05"),[Validators.required]),
    startTime: new FormControl('',[Validators.required]),
    endTime: new FormControl('',[Validators.required]),
    wage: new FormControl('',[Validators.required]),
    place: new FormControl('',[Validators.required]),
    name: new FormControl('',[Validators.required]),
    comments: new FormControl('')
  })

  get username(){
    return this.editShiftForm.get("username");
  }

  get date(){
    return this.editShiftForm.get("date");
  }

  get startTime(){
    return this.editShiftForm.get("startTime");
  }

  get endTime(){
    return this.editShiftForm.get("endTime");
  }

  get wage(){
    return this.editShiftForm.get("wage");
  }

  get place(){
    return this.editShiftForm.get("place");
  }

  get name(){
    return this.editShiftForm.get("name");
  }

  get comments(){
    return this.editShiftForm.get("comments");
  }

  OnSubmit(){
    
    if(this.editShiftForm.invalid){
    return;
    }
  }

  addDays(date:Date, days:number) {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  update(){
    this.showSpinner=true;
    if(this.editShiftForm.invalid){
      return;
    }
    // get values from form
    let startTime= this.editShiftForm.value['startTime'];
    let endTime= this.editShiftForm.value['endTime'];
    let wage = +this.editShiftForm.value['wage'];
    let place=this.editShiftForm.value['place'];
    let name=this.editShiftForm.value['name'];
    let date=(this.editShiftForm.value['date'].getTime());
    let comments=this.editShiftForm.value['comments'];
    let usrId = this.shiftToEdit['shift']['usrId'];
    // calculate times to get work duration
    let d1 = new Date(date);
    let timeArr = endTime.split(':');
    let newD1 = d1.setHours(+timeArr[0], +timeArr[1], 0, 0);
    d1 = new Date (newD1);
    let t1 = d1.getTime();
    timeArr = startTime.split(':');
    let d2 =new Date(date);
    let newD2 = d2.setHours(+timeArr[0], +timeArr[1], 0, 0);
    d2 = new Date (newD2);
    let t2 = d2.getTime();
    // if the shift ends the next day, add a day to the end of shift 
    if (t1 < t2){
      d1 = this.addDays(d1,1);
              }
    t1 = d1.getTime();
    // calculate profit
    let workDuration = (t1 - t2) / 3600000; // in hours
    let profit = +(+workDuration * wage).toFixed(2);

    
    
    let shift:Shift={usrId, profit, date,startTime,endTime,wage,place,name,comments};
    this.shiftServ.updateShift(this.clickedRowId,shift);
    this.showSpinner=false;
    this.notifier.showNotification("Shift updated!","OK","success","top");
    this.router.navigate(['/allShifts']);
  }

  ngOnInit(): void {
    this.clickedRow=this.shiftServ.getShiftRow();
    // console.log(JSON.stringify(this.clickedRow));
    this.clickedRowId = this.clickedRow.shiftId;
    // console.log(JSON.stringify(this.clickedRowId));
     this.Shifts= this.shiftServ.getAllShifts();
    // console.log(JSON.stringify(this.Shifts));
    this.shiftToEdit = this.Shifts.find((x)=>{
      return x.shiftId === this.clickedRowId;
    })
    // console.log("Shift to edit is: " + JSON.stringify(this.shiftToEdit));
    this.editShiftForm.controls['name'].setValue(this.shiftToEdit['shift']['name']);
    this.editShiftForm.controls['startTime'].setValue(this.shiftToEdit['shift']['startTime']);
    this.editShiftForm.controls['endTime'].setValue(this.shiftToEdit['shift']['endTime']);
    this.editShiftForm.controls['place'].setValue(this.shiftToEdit['shift']['place']);
    this.editShiftForm.controls['comments'].setValue(this.shiftToEdit['shift']['comments']);
    this.editShiftForm.controls['wage'].setValue(this.shiftToEdit['shift']['wage']);
    let shiftDate = new Date(this.shiftToEdit['shift']['date']);
    this.editShiftForm.controls['date'].setValue(shiftDate);
    this.editShiftForm.controls['username'].setValue(this.clickedRow['username']);
  }
}
