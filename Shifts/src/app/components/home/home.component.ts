import { Component, OnInit } from '@angular/core';
import { AuthServiceService } from 'src/app/services/auth-service.service';
import { Router } from '@angular/router';
import { NotifierService } from 'src/app/services/notifier.service';
import { UserServiceFirestoreService } from 'src/app/services/user-service-firestore.service';
import { User } from 'src/app/interfaces/user';
import { DatePipe } from '@angular/common';
import { UserService } from 'src/app/services/user.service';
import { ShiftFirestoreService } from 'src/app/services/shift-firestore.service';
import { Shift } from 'src/app/interfaces/shift';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit{
  constructor(private router:Router, private authService:AuthServiceService, private notifier:NotifierService, 
    private fireService:UserServiceFirestoreService, public user:UserService, private shiftFirestService:ShiftFirestoreService){}
    
  ngOnInit(): void {
    // this.usrShifts = this.shiftFirestService.getUserShifts();
    // console.log("Shiftturi aduse din service: " + JSON.stringify(this.usrShifts));
    // let item = localStorage.getItem("loggedUser");
    // if(item){
    //   let logUsrEmail = JSON.parse(item).email;
    //   this.fireService.getUsers().subscribe(data=>{
    //     let users=[];
    //        data.map(a=>{
    //        let user=a.payload.doc.data();
    //        let userID=a.payload.doc.id;
    //        users.push({user,userID})});
    //        this.logUser = users.find(x=>{
    //        return x.user['email'] === logUsrEmail;
    //    })
    //    if (this.logUser){
    //     // get all shifts in an array
    //     this.shiftFirestService.getShifts().subscribe(data=>{
    //     this.usrShifts=[];
    //     data.map(a=>{
    //       let shift=a.payload.doc.data();
    //       let shiftId=a.payload.doc.id;
    //       // select only the logged user shifts and store them in an array
    //       if (shift['usrId'] === this.logUser['userID']){
    //       this.usrShifts.push({shift,shiftId})}
    //     }) 
    //     if(this.usrShifts.length>0){
    //       let monYearStrArr:string[]=[];
    //       this.usrShifts.map(x=>monYearStrArr.push(this.monYearStr(x.shift['date'])));
    //       let monYearStrSet = new Set(monYearStrArr);
    //       monYearStrArr = [...monYearStrSet];
    //       let monYeaStrMap = new Map();
    //       for (let el of monYearStrArr) {
    //         let sum = 0;
    //         for (let elem of this.usrShifts){
    //           if (this.monYearStr(elem.shift['date']) == el) {
    //           sum += +elem.shift['profit'];
    //           }
    //       monYeaStrMap.set(el, sum);}
    //       }
    //       // let mostProfMonth = "";
    //       const max = Math.max(...monYeaStrMap.values());
    //       for (const [key, value] of monYeaStrMap){
    //       if (value == max){
    //       this.mostProfMonth = key;
    //       break;
    //       }
    //    }}
    //   //  console.log("Most prof month is: "+ this.mostProfMonth);
    //   })}})
      
    //   }
      }
    }