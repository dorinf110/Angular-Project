import { Component, OnInit } from '@angular/core';
import { AuthServiceService } from 'src/app/services/auth-service.service';
import { NotifierService } from 'src/app/services/notifier.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit{

  constructor(private authService:AuthServiceService, private notifier:NotifierService, private router:Router){}

  logout(){
    this.authService.SignOut();
    let item = localStorage.getItem("loggedAdmin");
    if(item){
      localStorage.setItem("loggedAdmin","");
      this.notifier.showNotification("You are logged out!", "OK", "warning",'bottom');
      this.router.navigate(['register']);
    }
   }

   ngOnInit(): void {
    let item = localStorage.getItem("loggedAdmin");
    // console.log("Item este: " + JSON.stringify(item));
    if(item){
     let loggeduserLoginTime = JSON.parse(item).lastLoginAt;
    // check if the user is logged in no more than an hour ago. Otherwise, logout user and navigate to login
        let curTime = (new Date()).getTime();
        if (curTime - loggeduserLoginTime > 3600000){
          this.notifier.showNotification("Login expired! Please, login again!","OK","warning","top");
          this.authService.SignOut();
          localStorage.setItem("loggedAdmin","");
          this.router.navigate(['login']);
        } 
        }
    else{
      this.router.navigate(['login']);
    }
   }
}
