import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/interfaces/user';
import { Shift } from 'src/app/interfaces/shift';
import { UserServiceFirestoreService } from 'src/app/services/user-service-firestore-service.service'; 
import { ShiftFirestoreService } from 'src/app/services/shift-firestore.service';
import { DispShift } from 'src/app/interfaces/disp-shift';


@Component({
  selector: 'app-week-shifts',
  templateUrl: './week-shifts.component.html',
  styleUrls: ['./week-shifts.component.css']
})
export class WeekShiftsComponent implements OnInit{

hasWPS:boolean=false;//variable to check if the logged user has shifts in the past week
hasMS:boolean=false;
hasShifts:boolean=false;
Shifts: any[];
dispShift:DispShift;
Users: any[];
displayedColumns:string[]=['username','date', 'startTime', 'endTime', 'wage','place','profit'];
dataSource;
initialDataSource;
dispShifts:DispShift[];
showSpinner:boolean=false;
submitted:boolean=true;
mostProfMonth:string;
worker:string; 
monthShifts:any[];
weekShifts:any[];

constructor(private userFireStoreServ:UserServiceFirestoreService, private shiftFirestService:ShiftFirestoreService){}

monYearStr(date){
  let actDate = new Date(date);
  let actYear = actDate.getFullYear();
  let actMonth = actDate.toLocaleString("default", {month: 'long'});
  return `${actMonth}-${actYear}`;
} 

ngOnInit(): void {
  // calculate 
  let today = new Date();
  let todayUT = today.getTime();
  let dayOfWeek=today.getDay();//3
  // get UT for the first day of the month
  const firstDay = new Date();
  firstDay.setFullYear(today.getFullYear(),today.getMonth(),1);
  firstDay.setHours(0,0,0);
  let firstMonthDayUT = firstDay.getTime();
  let firstDayOfTheWeek = new Date();
  firstDayOfTheWeek.setDate(today.getDate()-dayOfWeek);
  firstDayOfTheWeek.setHours(0,0,0);
  let firstDayOfTheWeekUT = firstDayOfTheWeek.getTime();
  this.userFireStoreServ.getUsers().subscribe(data=>{
   this.Users=[];
         data.map(a=>{
         let user=a.payload.doc.data();
         let userID=a.payload.doc.id;
         this.Users.push({user,userID})}
          );
//set allUsers in service
         this.userFireStoreServ.setAllUsers(this.Users);
         
// get AllShifts
         this.shiftFirestService.getShifts().subscribe(data=>{
          this.Shifts=[];
            data.map(a=>{
              let shift=a.payload.doc.data();
              let shiftId=a.payload.doc.id;
              this.Shifts.push({shift,shiftId})})

            //set allShifts in service
            if(this.Shifts.length>0){
              this.hasShifts=true;
              this.shiftFirestService.setAllShifts(this.Shifts);
            //filter the shifts from this month
              this.monthShifts=this.Shifts.filter((shift)=>{if(shift.shift['date'] >= firstMonthDayUT && shift.shift['date'] <= todayUT){
                return shift;
              }})
                       
            //filter the shifts from this week
            
            this.weekShifts=this.Shifts.filter((shift)=>{if(shift['shift']['date'] >= firstDayOfTheWeekUT && shift['shift']['date'] <= todayUT){
                return shift;
            }
           })}
            if (this.monthShifts.length > 0 ){
            this.hasMS=true;
             let monthUsers:string[]=[];
             for (let shift of this.monthShifts){
              let usrId:string ='';
                  usrId = shift.shift['usrId'];
                  let user = this.Users.find((x)=>{
                    return x['userID'] === usrId;
                  })
                  if (user != undefined){
                  let fNam:string='';
                  fNam = user.user.firstName;
                  let lNam:string='';
                  lNam = user.user.lastName;
                  let username:string=`${fNam} ${lNam}`;
                  monthUsers.push(username);
                  }}
              if(monthUsers.length >0){
                let maxCount = 0;
                let maxElement = null;
                const elementCount = {};
                for (let i = 0; i < monthUsers.length; i++) {
                  const element = monthUsers[i];
                  if (elementCount[element]) {
                    elementCount[element]++;
                  } else {
                    elementCount[element] = 1;
                  }
                  if (elementCount[element] > maxCount) {
                    maxCount = elementCount[element];
                    maxElement = element;
                  }
                }  
                this.worker=maxElement;
                // console.log("Worker " + this.worker);
              }
              }
            // if shifts have been found, change the date format from Unix time to date format
            if (this.weekShifts.length > 0 ){
              this.hasWPS=true;
              this.dispShifts=[];
              this.weekShifts=this.weekShifts.map((x)=>{x.shift['date'] = new Date(x.shift['date']);
                return x;
                })
              
          // prepare the array of shifts to display
                for (let shift of this.weekShifts){
                 
         // get user name from Users[]
                  let usrId:string ='';
                  usrId = shift.shift['usrId'];
                  let user = this.Users.find((x:string)=>{
                    return x['userID'] === usrId;
                  })
                  if (user != undefined){
                  let fNam:string='';
                  fNam = user.user.firstName;
                  let lNam:string='';
                  lNam = user.user.lastName;
                  let userID = shift.shift.userId;
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
                  this.dispShifts.push(newDispShift);}
              }
              let monYearStrArr:string[]=[];
                this.Shifts.map(x=>monYearStrArr.push(this.monYearStr(x.shift['date'])));
                let monYearStrSet = new Set(monYearStrArr);
                monYearStrArr = [...monYearStrSet];
                let monYeaStrMap = new Map();
                for (let el of monYearStrArr) {
                  let sum = 0;
                  for (let elem of this.Shifts){
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
        //   //  setting the dataSource=(array of DisplayShifts) for the table to be shown 
           this.dataSource=this.dispShifts;
           this.initialDataSource=this.dispShifts;
          })
           
         })
   }}