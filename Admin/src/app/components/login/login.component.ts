import { Component, OnInit } from '@angular/core';
import { AuthServiceService } from 'src/app/services/auth-service.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NotifierService } from 'src/app/services/notifier.service';
import { UserServiceFirestoreService } from 'src/app/services/user-service-firestore-service.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{
  constructor(private router:Router, private authService:AuthServiceService, private notifier:NotifierService, private userFireStoreServ:UserServiceFirestoreService){
   // get Admins from firestore
    this.userFireStoreServ.getAdmins().subscribe(async (data)=>{
      this.Admins=[];
        data.map(async a=>{
        let admin= await(a.payload.doc).data();
        this.Admins.push({admin})}
        );})
  }
  submitted=false;
  showSpinner=false;
  id:any='';
  Admins:any[];
  isAdmin:boolean=false;

  loginForm= new FormGroup({
    email: new FormControl('',[Validators.required,Validators.email]),
    password: new FormControl('',[Validators.required,Validators.pattern(/^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[^\w\d\s:])([^\s]){6,15}$/gm)]),
    })

  OnSubmit(){
    this.submitted=false;
    if(this.loginForm.invalid){
    return;
    }
  }  

  get email(){
    return this.loginForm.get("email");
  }

  get password(){
    return this.loginForm.get("password");
  }

  login(){
    this.showSpinner=true;
    // exit if form invalid
   if(this.loginForm.invalid){
      return;
    }
    // get inputs from user
    let email=this.loginForm.value['email'];
    let password=this.loginForm.value['password'];
    
    // check if there are admins registered and if there is one with the email entered
    if (this.Admins != undefined){
      if(this.Admins.some(x => x.admin.email === email)){
        this.isAdmin=true;
      }else{
        this.loginForm.reset();
        this.notifier.showNotification("There is no admin with this email! Please, register!", "OK", "error",'top');
        this.showSpinner=false;
        return;
      }
    }else{
      this.showSpinner=false;
      return;
    }
    // sign in 
    if (this.isAdmin){
    this.authService.SignIn(email,password).subscribe((data)=>{
      this.showSpinner=false;
      data.then(data=>{
        this.notifier.showNotification("You are logged in!", "OK", "success",'bottom');
        this.router.navigate['\home'];
      }).catch(()=>{
        this.notifier.showNotification("Email or password incorrect!", "OK", "error",'top');
        this.loginForm.reset();
        return;
      })} 
    )};    
  
  }

  ngOnInit(): void {}

}
