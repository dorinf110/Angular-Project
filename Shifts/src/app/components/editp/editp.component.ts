import { Component, OnInit } from '@angular/core';
import { UserServiceFirestoreService } from 'src/app/services/user-service-firestore.service';
import { User } from 'src/app/interfaces/user'; 
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { NotifierService } from 'src/app/services/notifier.service';


@Component({
  selector: 'app-editp',
  templateUrl: './editp.component.html',
  styleUrls: ['./editp.component.css']
})

export class EditpComponent implements OnInit{
  constructor(private router:Router, public fireService:UserServiceFirestoreService, private notifier:NotifierService){
  }
  submitted=false;
  showSpinner=false;
  Users:any=[];
  id:any='';
  now:Date=new Date();
  usersUid:string[];
  foundUsr:User;
  foundUsrId:string="";
  myString:string="";

  ngOnInit(): void {
    this.fireService.getUsers().subscribe(data=>{
     this.Users=[];
     data.map(a=>{
       let user=a.payload.doc.data();
       let userID=a.payload.doc.id;
       this.Users.push({user,userID});
    })
    let item = localStorage.getItem("loggedUser");
     if (item){
       let email=JSON.parse(item).email;
         this.foundUsr = this.Users.find(x=>{
         return x.user['email'] === email});
    this.foundUsrId = this.foundUsr['userID'];
    this.editForm.controls['firstName'].setValue(this.foundUsr['user']['firstName']);
    this.editForm.controls['lastName'].setValue(this.foundUsr['user']['lastName']);
    this.editForm.controls['username'].setValue(this.foundUsr['user']['username']);
    let dobUT = this.foundUsr['user']['birthDate'];
    let birthD = new Date (dobUT);
    this.editForm.controls['birthDate'].setValue(birthD);
    }});
   }

  //Custom validator to check correct DOB
  checkAge(dob:string):ValidatorFn{
    return (controls: AbstractControl)=>{
    const control = controls.get(dob);
    if(control==null){
    return null
    }
    const readDob = new Date(control.value);
    // check if age is between 3 and 130 years
    const tob = (new Date(control.value)).getTime();
    const currTime = (new Date()).getTime();
    const diff = (currTime - tob) / 31536000000;
    if((currTime - tob) / 31536000000 < 3 || (currTime - tob) / 31536000000 > 130 ){
      control.setErrors({age : true});
      this.notifier.showNotification("Incorrect date of birth! Age should be between 3 and 130 years!","OK","error",'bottom')
      return { age: true};
    }
      else{
      return null;
    }
  }
  }

  editForm=new FormGroup({
    firstName:new FormControl('',[Validators.required,Validators.pattern(/^[A-Z][a-z]{2,20}$/)]),
    lastName:new FormControl('',[Validators.required,Validators.pattern(/^[A-Z][a-z]{2,20}$/)]),
    birthDate: new FormControl(new Date("2003,11,07"),[Validators.required]),
    username: new FormControl('',[Validators.required,Validators.pattern(/^[A-Za-z](\w){5,}$/)])
  },{
    validators:[this.checkAge("birthDate")]
  })

  get birthDate(){
    return this.editForm.get("birthDate");
  }

  get firstName(){
    return this.editForm.get("firstName");
  }

  get lastName(){
    return this.editForm.get("lastName");
  }

  get username(){
    return this.editForm.get("username");
  }

  OnSubmit(){
    this.submitted=false;
    if(this.editForm.invalid){
    return;
    }
  }

  update(){
    this.showSpinner=true;
    this.submitted=true;

    if(this.editForm.invalid){
      return;
    }
    
    let password= this.foundUsr['user']['password'];
    let email = this.foundUsr['user']['email'];
    let firstName=this.editForm.value['firstName'];
    let lastName=this.editForm.value['lastName'];
    let birthDate=(this.editForm.value['birthDate'].getTime());
    let username=this.editForm.value['username'];
    
    
    let user:User={firstName,lastName,password,username,birthDate,email};

    this.fireService.updateUser(this.foundUsrId,user,'users');
    this.showSpinner=false;
    this.notifier.showNotification("User updated!","OK","success","top");
    this.router.navigate(['/home']);
    
  }
  

}
