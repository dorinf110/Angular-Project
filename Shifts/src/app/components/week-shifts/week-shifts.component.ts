import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/interfaces/user';
import { Shift } from 'src/app/interfaces/shift';
import { DispShift } from 'src/app/interfaces/disp-shift';
import { UserServiceFirestoreService } from 'src/app/services/user-service-firestore.service';
import { ShiftFirestoreService } from 'src/app/services/shift-firestore.service';


@Component({
  selector: 'app-week-shifts',
  templateUrl: './week-shifts.component.html',
  styleUrls: ['./week-shifts.component.css']
})
export class WeekShiftsComponent implements OnInit{

hasWPS:boolean=false;//variable to check if the logged user has shifts in the past week
logUser:{user:User, userID:string};
userShifts: any[];
dispShift:DispShift;
Shifts:any[];
displayedColumns:string[]=['date', 'startTime', 'endTime', 'wage','place','profit'];
dataSource;
initialDataSource;
dispShifts:DispShift[];
showSpinner:boolean=false;
submitted:boolean=true;
mostProfMonth:string; 


constructor(private userFireStoreServ:UserServiceFirestoreService, private shiftFirestService:ShiftFirestoreService){}

monYearStr(date){
  let actDate = new Date(date);
  let actYear = actDate.getFullYear();
  let actMonth = actDate.toLocaleString("default", {month: 'long'});
  return `${actMonth}-${actYear}`;
} 

ngOnInit(): void {
  let today = new Date();
  // today.setHours(0,0,0);
  let todayUT = today.getTime();
  let dayOfWeek=today.getDay();//3
  // let firstDayOfTheWeekUT = todayUT - (dayOfWeek * (24 * 3600 * 1000));
  // let endDayOfTheWeekUT = firstDayOfTheWeekUT + (6 * 24 * 3600 * 1000);
  let firstDayOfTheWeek = new Date();
  firstDayOfTheWeek.setDate(today.getDate()-dayOfWeek);
  firstDayOfTheWeek.setHours(0,0,0);
  let firstDayOfTheWeekUT = firstDayOfTheWeek.getTime();
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
      //set variable in ShiftFirestoreService
      // console.log("Shifturi puse in service: "+ JSON.stringify(this.Shifts));
      this.shiftFirestService.setUserShifts(this.Shifts);
      this.userShifts = this.Shifts;
      //filter the shifts from this week
        this.Shifts=this.Shifts.filter((shift)=>{if(shift.shift['date'] >= firstDayOfTheWeekUT && shift.shift['date'] <= todayUT){
        return shift;
      }
    }) 
      // if shifts have been found, change the date format from Unix time to date format
      if (this.Shifts.length > 0 ){
        this.hasWPS=true;
        this.dispShifts=[];
        this.Shifts=this.Shifts.map((x)=>{x.shift['date'] = new Date(x.shift['date']);
          return x;
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
        let monYearStrArr:string[]=[];
          this.userShifts.map(x=>monYearStrArr.push(this.monYearStr(x.shift['date'])));
          let monYearStrSet = new Set(monYearStrArr);
          monYearStrArr = [...monYearStrSet];
          let monYeaStrMap = new Map();
          for (let el of monYearStrArr) {
            let sum = 0;
            for (let elem of this.userShifts){
              if (this.monYearStr(elem.shift['date']) == el) {
              sum += +elem.shift['profit'];
              }
          monYeaStrMap.set(el, sum);}
          }
          // let mostProfMonth = "";
          const max = Math.max(...monYeaStrMap.values());
          for (const [key, value] of monYeaStrMap){
          if (value == max){
          this.mostProfMonth = key;
          break;
          }
       }
     }
    //  setting the dataSource=(array of DisplayShifts) for the table to be shown 
     this.dataSource=this.dispShifts;
     this.initialDataSource=this.dispShifts;
    })
   }  
   })
  }
}}
