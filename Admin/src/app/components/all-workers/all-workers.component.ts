import { Component, OnInit } from '@angular/core';
import { Shift } from 'src/app/interfaces/shift';
import { DispUser } from 'src/app/interfaces/disp-user';
import { ShiftFirestoreService } from 'src/app/services/shift-firestore.service';
import { UserServiceFirestoreService } from 'src/app/services/user-service-firestore-service.service';
import { DispShift } from 'src/app/interfaces/disp-shift';
import { FormGroup, FormControl } from '@angular/forms';
import { NotifierService } from 'src/app/services/notifier.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-all-workers',
  templateUrl: './all-workers.component.html',
  styleUrls: ['./all-workers.component.css']
})
export class AllWorkersComponent implements OnInit{
  constructor (private shiftFirestService:ShiftFirestoreService, private userFireStoreServ:UserServiceFirestoreService, private notifier:NotifierService,
    private router:Router){}


hasWorkers:boolean=false;//variable to check if there are  registered workers

Users: any[];
displayedColumns:string[]=['email','password','firstName', 'lastName','birthDate'];
dataSource;
initialDataSource;
dispUsers:DispUser[];
showSpinner:boolean=false;
submitted:boolean=true;
mostProfMonth:string;
worker:string; 
monthShifts:any[];

    
clickWorkerRow(row){
  this.userFireStoreServ.clickUserRow(row);
  // console.log("Clciked row is: " + JSON.stringify(row));
  this.router.navigate(['edit-profile']);
}

ngOnInit(): void {
    this.userFireStoreServ.getUsers().subscribe(data=>{
      this.Users=[];
      data.map(a=>{
      let user=a.payload.doc.data();
      let userID=a.payload.doc.id;
      this.Users.push({user,userID})});
  // if workers have been found, change the date format from Unix time to date format
      if (this.Users.length > 0 ){
      this.hasWorkers=true;
      this.dispUsers=[];
      this.Users=this.Users.map((x)=>{x.user['birthDate'] = new Date(x.user['birthDate']);
      return x;});
  // prepare the array of shifts to display
     for (let user of this.Users){
      let birthDate:string = user.user.birthDate;
      let password:string = user.user.password;
      let firstName:string = user.user.firstName;
      let lastName:string = user.user.lastName;
      let email: string = user.user.email;
      let userId:string=user.userID;

  // create a new object of type DisplayShift (data to be shown in the shifts table) 
      let newDispUser: DispUser = {userId, email, password, firstName, lastName, birthDate};
  // push the object in an array 
      this.dispUsers.push(newDispUser);}}
  //   //  setting the dataSource=array of DisplayShifts for the table to be shown 
      this.dataSource=this.dispUsers;
      this.initialDataSource=this.dispUsers;})
}
}
