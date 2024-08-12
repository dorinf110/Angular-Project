import { Component, OnInit } from '@angular/core';
import { AuthServiceService } from 'src/app/services/auth-service.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { NotifierService } from 'src/app/services/notifier.service';
import { UserServiceFirestoreService } from 'src/app/services/user-service-firestore.service'; 

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{
  constructor(private userService:UserService, private router:Router, private authService:AuthServiceService, 
    private notifier:NotifierService, private userFireStoreServ:UserServiceFirestoreService){
    // get users from Firestore  // 
    this.userFireStoreServ.getUsers().subscribe(async (data)=>{
      this.Users=[];
        data.map(async a=>{
        let user= await(a.payload.doc).data();
        this.Users.push({user})}
        );})
  }
  submitted=false;
  showSpinner=false;
  Users:any=[];
  id:any='';
  isUser:boolean=false;

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
    this.submitted=true;
// exit if form invalid
    if(this.loginForm.invalid){
      return;
    }
    // get inputs from user
    let email=this.loginForm.value['email'];
    let password=this.loginForm.value['password'];

     // check if there are users registered and if there is one with the email entered
     if (this.Users != undefined){
      if(this.Users.some(x => x.user.email === email)){
        this.isUser=true;
      }else{
        this.loginForm.reset();
        this.notifier.showNotification("There is no user with this email! Please, register!", "OK", "error",'top');
        this.showSpinner=false;
        return;
      }
    }else{
      this.showSpinner=false;
      return;
    }

  // sign in 
    if (this.isUser){
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
