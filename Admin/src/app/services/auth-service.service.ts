import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';
// import { AuthUser } from '../interfaces/auth-user';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {
  login=false; //keeps the state of user logging 
  txtNavBarLoginTxt="Login";
  userData:any;
  uid:string;
  logTime:number;
  errorCode:string="";
  errorMessage:string="";
  


  constructor(public Auth:AngularFireAuth, private router:Router) { 
    //set logged admin in localstorage or delete it when no logged
    this.Auth.authState.subscribe(admin=>{
      if(admin){
        this.userData=admin;
        localStorage.setItem('loggedAdmin',JSON.stringify(this.userData));
          if(admin){
            this.login=true;
            this.router.navigate(['home']);
          }
        }
      else {
        localStorage.setItem("loggedAdmin","");
        this.login=false;
      }
    })
  }

  SignUp(email:string,password:string){
    // at signup we set the user to be already logged in
    this.login=true;
    return of(this.Auth.createUserWithEmailAndPassword(email,password));
  }

  SignIn(email:string,password:string){
    return of(this.Auth.signInWithEmailAndPassword(email,password));
  }

  SignOut(){
    return of(this.Auth.signOut());
  }

}
