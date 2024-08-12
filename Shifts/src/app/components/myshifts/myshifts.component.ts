import { Component, OnInit } from '@angular/core';
import { Shift } from 'src/app/interfaces/shift';
import { User } from 'src/app/interfaces/user';
import { ShiftFirestoreService } from 'src/app/services/shift-firestore.service';
import { UserServiceFirestoreService } from 'src/app/services/user-service-firestore.service';
import { DispShift } from 'src/app/interfaces/disp-shift';
import { FormGroup, FormControl } from '@angular/forms';
import { NotifierService } from 'src/app/services/notifier.service';
import { Router } from '@angular/router';



@Component({
  selector: 'app-myshifts',
  templateUrl: './myshifts.component.html',
  styleUrls: ['./myshifts.component.css']
})
export class MyshiftsComponent implements OnInit{
  constructor (private shiftFirestService:ShiftFirestoreService, private userFireStoreServ:UserServiceFirestoreService, private notifier:NotifierService,
    private router:Router){}

  haveShifts:boolean=false;
  Shifts:any[];
  users:any[];
  logUser:User;
  displayedColumns:string[]=['date', 'startTime', 'endTime', 'wage','place','profit'];
  dataSource;
  initialDataSource;
  dispShifts:DispShift[];
  showSpinner:boolean=false;
  submitted:boolean=true;  

  // lgUsrId(event){
  //   this.logUsrId = event;
  // }

  searchForm=new FormGroup({
    sDate:new FormControl(''),
    eDate:new FormControl(''),
    place: new FormControl('')
  })

  addDays(date:Date, days:number) {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
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
      this.dispShifts=this.dispShifts.filter(shift=>{
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

  search(){
    // get values from the inputs
    let sDate = this.searchForm.value['sDate'];
    let eDate = this.searchForm.value['eDate'];
    let place = this.searchForm.value['place'];

    if (sDate != '' && sDate != null){
      if (eDate != '' && eDate != null ){
        this.filterByDate(sDate,eDate);
        if (place !='' && place != null){
          this.filterByPlace(place);
          return;
        } 
      }
      else if(place == '' || place == null){
        this.notifier.showNotification("Please enter the correct end date!", "OK", "error", "top");
        return;
      }
    }
    else{
      if (place !='' && place != null){
        this.filterByPlace(place);
        return;
      }
      else {
        this.notifier.showNotification("Please enter search criteria, dates or place!", "OK", "warning", "bottom");
        return;
      }
    }}
    
  Cancel(){
    this.searchForm.reset();
    // this.dataSource=this.initialDataSource;
    this.dispShifts=this.initialDataSource;
    this.dataSource = this.dispShifts;
  }

  clickedRow(row){
    this.shiftFirestService.setClickedRow(row);
    this.router.navigate(['/edit-shift']);
  } 
  
  ngOnInit(): void {
    // get logged user
    // this.logUser = this.userServ.logUser;
    let item = localStorage.getItem("loggedUser");
    if(item){
      let logUsrEmail = JSON.parse(item).email;
      this.userFireStoreServ.getUsers().subscribe(data=>{
        let users=[];
           data.map(a=>{
           let user=a.payload.doc.data();
           let userID=a.payload.doc.id;
           users.push({user,userID})});
           this.logUser = users.find(x=>{
           return x.user['email'] === logUsrEmail;
       })
       if (this.logUser){
        // get all shifts in an array
        this.shiftFirestService.getShifts().subscribe(data=>{
        this.Shifts=[];
        data.map(a=>{
          let shift=a.payload.doc.data();
          let shiftId=a.payload.doc.id;
          // select only the logged user shifts and store them in an array
          if (shift['usrId'] === this.logUser['userID']){
          this.Shifts.push({shift,shiftId})}
        })
        // if shifts have been found, change the date format from Unix time to date format
        if (this.Shifts.length > 0 ){
          this.haveShifts=true;
          this.dispShifts=[];
          this.Shifts=this.Shifts.map((shift)=>{shift.shift['date'] = new Date(shift.shift['date']);
          return shift;
          })
          // prepare the array of shifts to display 
          for (let shift of this.Shifts){
            let date:string = shift.shift.date;
            let startTime:string = shift.shift.startTime;
            let endTime:string = shift.shift.endTime;
            let wage:number = shift.shift.wage;
            let place: string = shift.shift.place;
            let shiftId = shift.shiftId;
            let profit = shift.shift.profit;
            // create a new object of type DisplayShift (data to be shown in the shifts table) 
            let newDispShift: DispShift = {shiftId, date, startTime, endTime, wage, place, profit};
            // push the object in an array 
            this.dispShifts.push(newDispShift);
          }
       }
      //  setting the dataSource=(array of DisplayShifts) for the table to be shown 
       this.dataSource=this.dispShifts;
       this.initialDataSource=this.dispShifts;
      })
     }  
     })
    }
   };
  }

