import { Component, OnInit } from '@angular/core';
import { AuthServiceService } from 'src/app/services/auth-service.service';
import { Router } from '@angular/router';
import { NotifierService } from 'src/app/services/notifier.service';
import { UserServiceFirestoreService } from 'src/app/services/user-service-firestore.service';
import { User } from 'src/app/interfaces/user';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  constructor(
    private router: Router,
    private authService: AuthServiceService,
    private notifier: NotifierService,
    private userServ: UserService,
    private userFireStoreServ: UserServiceFirestoreService
  ) {}

  logUser: { user: User; userID: string };
  loggedUserEmail: string;
  loggeduserLoginTime: number;
  users:User[];

  logout() {
    this.authService.SignOut();
    let item = localStorage.getItem('loggedUser');
    if (item) {
      localStorage.setItem('loggedUser', '');
      this.notifier.showNotification(
        'You are logged out!',
        'OK',
        'warning',
        'bottom'
      );
      this.router.navigate(['register']);
    }
  }

  ngOnInit(): void {
    // Get logged user email from localstorage and based on email get user from firebase
    let item = localStorage.getItem('loggedUser');
    // console.log("Item este: " + JSON.stringify(item));
    if (item) {
      this.loggedUserEmail = JSON.parse(item).email;
      this.loggeduserLoginTime = JSON.parse(item).lastLoginAt;
      // check if the user is logged in no more than an hour ago. Otherwise, logout user and navigate to login
      let curTime = new Date().getTime();
      if (curTime - this.loggeduserLoginTime > 3600000) {
        this.notifier.showNotification(
          'Login expired! Please, login again!',
          'OK',
          'warning',
          'top'
        );
        this.authService.SignOut();
        localStorage.setItem('loggedUser', '');
        this.router.navigate(['login']);
      }
      // get loggeduser from firestore to show username on navbar
      this.userFireStoreServ.getUsers().subscribe((data) => {
        let users = [];
        data.map((a) => {
          let user = a.payload.doc.data();
          let userID = a.payload.doc.id;
          users.push({ user, userID });
        });
        this.logUser = users.find((x) => {
          return x.user.email === this.loggedUserEmail;
        });
      });
    } else {
      this.router.navigate(['login']);
    }
  }
}
