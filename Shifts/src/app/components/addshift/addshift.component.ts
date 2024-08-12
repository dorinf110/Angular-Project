import { Component, OnInit } from '@angular/core';
import { UserServiceFirestoreService } from 'src/app/services/user-service-firestore.service';
import { User } from 'src/app/interfaces/user'; 
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators} from '@angular/forms';
import { NotifierService } from 'src/app/services/notifier.service';
import { Shift } from 'src/app/interfaces/shift';
import { ShiftFirestoreService } from 'src/app/services/shift-firestore.service';
import { UserService } from 'src/app/services/user.service';


@Component({
  selector: 'app-addshift',
  templateUrl: './addshift.component.html',
  styleUrls: ['./addshift.component.css']
})
export class AddshiftComponent implements OnInit{
  constructor(private router:Router, public fireService:UserServiceFirestoreService, private notifier:NotifierService, 
    private shiftFirestService:ShiftFirestoreService, private userServ:UserService){
  }
  submitted=false;
  showSpinner=false;
  Users:any=[];
  id:any='';
  now:Date=new Date();
  foundUsr:User;
  logUsrId:string;
  Shifts:any[];
  nameEntered:string;

  addShiftForm=new FormGroup({
    date:new FormControl('',[Validators.required]),
    sTime:new FormControl('',[Validators.required]),
    eTime: new FormControl('',[Validators.required]),
    wage: new FormControl('',[Validators.required]),
    place: new FormControl('',[Validators.required]),
    name: new FormControl('',[Validators.required]),
    comments: new FormControl('')
  })

  get date(){
    return this.addShiftForm.get("date");
  }

  get sTime(){
    return this.addShiftForm.get("sTime");
  }

  get eTime(){
    return this.addShiftForm.get("eTime");
  }

  get wage(){
    return this.addShiftForm.get("wage");
  }

  get place(){
    return this.addShiftForm.get("place");
  }

  get name(){
    return this.addShiftForm.get("name");
  }

  OnSubmit(){
    this.submitted=false;
    if(this.addShiftForm.invalid){
    return;
    }
  }

  ngOnInit(){
    this.fireService.getUsers().subscribe(data=>{
      this.Users=[];
      data.map(a=>{
        let user=a.payload.doc.data();
        let userID=a.payload.doc.id;
        this.Users.push({user,userID});
     })
    let item = localStorage.getItem("loggedUser");
     if (item){
       let email=JSON.parse(item).email;
         this.foundUsr = this.Users.find(x=>{
         return x.user['email'] === email});
    this.logUsrId = this.foundUsr['userID'];
  }})
    this.shiftFirestService.getShifts().subscribe(data=>{
      this.Shifts=[];
      data.map(a=>{
        let shift=a.payload.doc.data();
        // if (shift['usrId'] === this.userServ.logUser['userID']){
        // this.Shifts.push(shift);}
        if (shift['usrId'] === this.logUsrId){
        this.Shifts.push(shift);}
      })
    })
    
  }
  
  addDays(date:Date, days:number) {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  addShift(){
    this.showSpinner=true;
    this.submitted=true;
    if(this.addShiftForm.invalid){
      return;
    }
    let date=new Date(this.addShiftForm.value['date']).getTime();
    let startTime=this.addShiftForm.value['sTime'];
    let endTime=this.addShiftForm.value['eTime'];
    let wage=+this.addShiftForm.value['wage'];
    // check if the end time is later than present time
  
    let place=(this.addShiftForm.value['place']);
    let name=this.addShiftForm.value['name'];
    if(this.Shifts.some(x=> x['name'] === name)){
      this.notifier.showNotification("Shift name already used!","OK","warning","top");
      this.showSpinner=false;
      return;
    }    
    let comments=this.addShiftForm.value['comments'];
    let usrId= this.logUsrId;

    let today= new Date();
    let d1 = new Date(date);
    let timeArr = endTime.split(':');
    let newD1 = d1.setHours(+timeArr[0], +timeArr[1], 0, 0);
    d1 = new Date (newD1);
    let t1 = d1.getTime();
    if (t1 > today.getTime()){
      this.notifier.showNotification("Date or endtime cannot be later than present time!", "OK","warning","top");
      this.showSpinner=false;
      return;
    }
    if(this.Shifts.some(x=> x['date'] === date)){
      this.notifier.showNotification("Shift already recorded for this date!","OK","warning","top");
      this.showSpinner=false;
      return;
    }   
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


    let shift:Shift={usrId, date, startTime, endTime, wage, place, name, comments, profit}
    this.shiftFirestService.saveShift(shift);
    this.showSpinner=false;
    this.notifier.showNotification("Shift added!","OK","success","top");
    this.addShiftForm.reset();
  }
}
