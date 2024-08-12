import { Component, OnInit } from '@angular/core';
import { Shift } from 'src/app/interfaces/shift';
import { User } from 'src/app/interfaces/user';
import { ShiftFirestoreService } from 'src/app/services/shift-firestore.service';
import { UserServiceFirestoreService } from 'src/app/services/user-service-firestore-service.service';
import { DispShift } from 'src/app/interfaces/disp-shift';
import { FormGroup, FormControl } from '@angular/forms';
import { NotifierService } from 'src/app/services/notifier.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-all-shifts',
  templateUrl: './all-shifts.component.html',
  styleUrls: ['./all-shifts.component.css']
})
export class AllShiftsComponent implements OnInit{
  constructor (private shiftFirestService:ShiftFirestoreService, private userFireStoreServ:UserServiceFirestoreService, private notifier:NotifierService,
    private router:Router){}

hasShifts:boolean=false;//variable to check if the logged user has shifts in the past week
Shifts: any[];
dispShift:DispShift;
Users: any[];
displayedColumns:string[]=['username','date', 'startTime', 'endTime', 'wage','place','profit'];
dataSource:DispShift[];
initialDataSource:DispShift[];
dispShifts:DispShift[];
showSpinner:boolean=false;
submitted:boolean=true;
mostProfMonth:string;
worker:string; 
monthShifts:any[];
userFound:any[];
isFilter:boolean=false;

searchForm=new FormGroup({
  username:new FormControl(''),
  sDate:new FormControl(''),
  eDate:new FormControl(''),
  place: new FormControl('')
});
    
clickShiftRow(row){
  this.shiftFirestService.clickShiftRow(row);
  this.router.navigate(['edit-shift']);
}

Cancel(){
  this.searchForm.reset();
  // this.dataSource=this.initialDataSource;
  this.dispShifts=this.initialDataSource;
  this.dataSource = this.dispShifts;
  this.router.navigate(['home']);
}

OnSubmit(){
  // this.submitted=false;
  if(this.searchForm.invalid){
  return;
  }
}

filterByDate(startDate:string, endDate:string,){
  let sDateUT = (new Date(startDate)).getTime();
    let eDateUT = (new Date(endDate)).getTime();
    if(eDateUT < sDateUT){
      this.notifier.showNotification("The start date cannot be after the end date","OK","warning","top");
      this.searchForm.reset();
      return;
    }
    let newDispShifts:any[];
     this.dispShifts=this.dispShifts.filter((shift)=>{
      if((new Date(shift.date)).getTime() >= sDateUT && (new Date(shift.date)).getTime() <= eDateUT) {
      return shift;
    }
      else return null;  
    });
    this.dataSource=this.dispShifts;
}

filterByPlace(place:string){
  this.dispShifts = this.dispShifts.filter((shift)=>shift.place === place);
  this.dataSource=this.dispShifts;
}

filterByName(name:string){
  this.dispShifts = this.dispShifts.filter((shift)=>shift.username === name);
  this.dataSource=this.dispShifts;
}

filterById(Id:string){
  this.dispShifts = this.dispShifts.filter((shift)=>shift.userID === Id);
  this.dataSource=this.dispShifts;
}


search(){
  // reset diplay shifts array
  // this.dispShifts = this.initialDataSource;
  // this.dataSource = this.dispShifts;
  // get values from the inputs
  let sDate = this.searchForm.value['sDate'];
  let eDate = this.searchForm.value['eDate'];
  let place = this.searchForm.value['place'];
  let username = this.searchForm.value['username'];

  if (sDate != '' && sDate != null){
    if (eDate != '' && eDate != null ){
      this.filterByDate(sDate,eDate);
      if (place !='' && place != null){
        this.filterByPlace(place);}
        if(username !='' && username!=''){
          this.filterByName(username);
         return;
        }
        
      }
    else if((place == '' || place == null) && (username =='' || username == null)){
      this.notifier.showNotification("Please enter the correct end date!", "OK", "error", "top");
      return;
    }
    else {
      if (place !='' && place != null){
        this.filterByPlace(place);
        if(username !='' && username!=''){
          this.filterByName(username);
        }
        if (sDate != '' && sDate != null){
          if (eDate != '' && eDate != null ){
            this.filterByDate(sDate,eDate);
        return;    
      }}
      
    }}
  }
  else{
    if (place !='' && place != null){
      this.filterByPlace(place);
      if (username != '' && username != null){
        this.filterByName(username);
       return;
      }
      
    }
    else {
      if(username !='' && username!=''){
        this.filterByName(username);
       return;
      }else{
      this.notifier.showNotification("Please enter search criteria, dates or place!", "OK", "warning", "bottom");
      }
    }
  }}

public ngOnInit(): void {
    this.userFireStoreServ.getUsers().subscribe(data=>{
      this.Users=[];
      data.map(a=>{
      let user=a.payload.doc.data();
      let userID=a.payload.doc.id;
      this.Users.push({user,userID})});
  //  console.log("Users are: " + JSON.stringify(this.Users));
    this.shiftFirestService.getShifts().subscribe(data=>{
      this.Shifts=[];
      data.map(a=>{
      let shift=a.payload.doc.data();
      let shiftId=a.payload.doc.id;
      this.Shifts.push({shift,shiftId})})
  // if shifts have been found, change the date format from Unix time to date format
      if (this.Shifts.length > 0 ){
      this.hasShifts=true;
      this.dispShifts=[];
      this.Shifts=this.Shifts.map((x)=>{x.shift['date'] = new Date(x.shift['date']);
      return x;});
  // prepare the array of shifts to display
     for (let shift of this.Shifts){
  // get user name from Users[]
     let usrId:string ='';
     usrId = shift.shift['usrId'];
     let userFound = this.Users.find((x)=>{
        return x.userID === usrId;})
      // console.log("User found is: " +JSON.stringify(userFound));  
      if (userFound != undefined){
        this.userFound = userFound;
        // console.log("user != undefined");      
        let fNam:string='';
        fNam = userFound.user.firstName;
        let lNam:string='';
        lNam = userFound.user.lastName;
        let userID = shift.shift.usrId;
        let date:string = shift.shift.date;
        let startTime:string = shift.shift.startTime;
        let endTime:string = shift.shift.endTime;
        let wage:number = shift.shift.wage;
        let place: string = shift.shift.place;
        let shiftId = shift.shiftId;
        let profit = shift.shift.profit;
        let username:string=`${fNam} ${lNam}`;
  // create a new object of type DisplayShift (data to be shown in the shifts table) 
        let newDispShift: DispShift = {userID,username,shiftId, date, startTime, endTime, wage, place, profit};
  // push the object in an array 
        this.dispShifts.push(newDispShift)}}}
  //   //  setting the dataSource=array of DisplayShifts for the table to be shown 
      this.dataSource=this.dispShifts;
      this.initialDataSource=this.dispShifts;
      if (this.shiftFirestService.getUserIdShifts() != ''){
        this.isFilter=true;
        this.filterById(this.shiftFirestService.getUserIdShifts());
        this.shiftFirestService.setUserIdShidfts('');
      }
    })
})
}
}