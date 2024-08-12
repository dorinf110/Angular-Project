import { Injectable } from '@angular/core';
import { UserServiceFirestoreService } from './user-service-firestore.service';
import { Router } from '@angular/router';
import { User } from '../interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  
  public logUser:User;
  
  constructor(private userFireStoreServ:UserServiceFirestoreService, private router:Router) { 
    // let item = localStorage.getItem("loggedUser");
    // if(item){
    //   let logUsrEmail = JSON.parse(item).email;
    //   this.userFireStoreServ.getUsers().subscribe(data=>{
    //     let users=[];
    //        data.map(a=>{
    //        let user=a.payload.doc.data();
    //        let userID=a.payload.doc.id;
    //        users.push({user,userID})});
    //        this.logUser = users.find(x=>{
    //        return x.user['email'] === logUsrEmail;
    //    })
    //   //  console.log("User service constructor loggeduser is: " + JSON.stringify(this.logUser));
    //  })
    // }
    // else{
    //   this.router.navigate['/login'];
    // }
  }

  // getLoggeddUser(){
  //   let item = localStorage.getItem("loggedUser");
  //   // console.log("Item este: " + JSON.stringify(item));
  //   if(item){
  //     let logUsrEmail = JSON.parse(item).email;
  //     // console.log("logged user email is: "+ logUsrEmail)
  //     this.userFireStoreServ.getUsers().subscribe(data=>{
  //       let users=[];
  //          data.map(a=>{
  //          let user=a.payload.doc.data();
  //          let userID=a.payload.doc.id;
  //          users.push({user,userID})});
  //          this.logUser = users.find(x=>{
  //           // console.log("x email is:" + x.user['email'])
  //          return x.user.email === logUsrEmail;
  //      })
  //     //  console.log("return loguser is: "+ JSON.stringify(this.logUser));
  //      return this.logUser;
  //    })
     
  //   }
  //   else{
  //     return null;
  //   }
  // }
  
}
