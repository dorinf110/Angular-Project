import { Component, OnInit } from '@angular/core';
import { NotifierService } from 'src/app/services/notifier.service';
import {
  FormGroup,
  FormControl,
  AbstractControl,
  Validators,
  ValidatorFn,
} from '@angular/forms';
import { User } from 'src/app/interfaces/user';
import { UserServiceFirestoreService } from 'src/app/services/user-service-firestore-service.service';
import { AuthServiceService } from 'src/app/services/auth-service.service';
import { Router } from '@angular/router';
import { ShiftFirestoreService } from 'src/app/services/shift-firestore.service';
@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css'],
})
export class EditProfileComponent implements OnInit {
  constructor(
    private notifier: NotifierService,
    private fireService: UserServiceFirestoreService,
    private authService: AuthServiceService,
    private router: Router,
    private shiftFirestore: ShiftFirestoreService
  ) {}

  clickedRow: {
    userId: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    birthDate: string;
  };
  Users: any[];
  showSpinner: boolean = false;

  // custom validator to check passwords matching
  matching(controlName: string, checkControlName: string): ValidatorFn {
    return (controls: AbstractControl) => {
      const control = controls.get(controlName);
      const checkControl = controls.get(checkControlName);
      if (control == null) return null;
      if (checkControl == null) return null;
      if (control.value !== checkControl.value) {
        checkControl.setErrors({ matching: true });
        return { matching: true };
      } else {
        return null;
      }
    };
  }

  //Custom validator to check correct DOB
  checkAge(dob: string): ValidatorFn {
    return (controls: AbstractControl) => {
      const control = controls.get(dob);
      if (control == null) {
        return null;
      }
      // const readDob = new Date(control.value);
      const tob = new Date(control.value).getTime();
      const currTime = new Date().getTime();
      // const diff = (currTime - tob) / 31536000000;
      if (
        (currTime - tob) / 31536000000 < 3 ||
        (currTime - tob) / 31536000000 > 130
      ) {
        control.setErrors({ age: true });
        this.notifier.showNotification(
          'Incorrect date of birth! Age should be between 3 and 130 years!',
          'OK',
          'error',
          'bottom'
        );
        return { age: true };
      } else {
        return null;
      }
    };
  }

  editForm = new FormGroup(
    {
      firstName: new FormControl('', [
        Validators.required,
        Validators.pattern(/^[A-Z][a-z]{2,20}$/),
      ]),
      lastName: new FormControl('', [
        Validators.required,
        Validators.pattern(/^[A-Z][a-z]{2,20}$/),
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.pattern(
          /^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[^\w\d\s:])([^\s]){6,15}$/gm
        ),
      ]),
      passwordConf: new FormControl('', [
        Validators.required,
        Validators.pattern(
          /^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[^\w\d\s:])([^\s]){6,15}$/gm
        ),
      ]),
      email: new FormControl('', [Validators.required, Validators.email]),
      username: new FormControl('', [
        Validators.required,
        Validators.pattern(/^[A-Za-z](\w){5,}$/),
      ]),
      birthDate: new FormControl(new Date('2003,11,07'), [Validators.required]),
    },
    {
      validators: [
        this.matching('password', 'passwordConf'),
        this.checkAge('birthDate'),
      ],
    }
  );

  get birthDate() {
    return this.editForm.get('birthDate');
  }

  get firstName() {
    return this.editForm.get('firstName');
  }

  get lastName() {
    return this.editForm.get('lastName');
  }

  get password() {
    return this.editForm.get('password');
  }

  // get passwordConf() {
  //   return this.editForm.get('passwordConf');
  // }

  get email() {
    return this.editForm.get('email');
  }

  get username() {
    return this.editForm.get('username');
  }

  OnSubmit() {
    if (this.editForm.invalid) {
      return;
    }
  }

  delete() {
    this.showSpinner = true;
    if (this.editForm.invalid) {
      return;
    }
    this.fireService.deleteUser(this.clickedRow.userId);
    // delete user's shifts
    this.shiftFirestore.getShifts().subscribe(data=>{
      let Shifts=[];
      data.map(a=>{
      let shift=a.payload.doc.data();
      let shiftId=a.payload.doc.id;
      Shifts.push({shift,shiftId})})
      for (let shiftObj of Shifts){
        if(shiftObj.shift['usrId'] === this.clickedRow.userId){
          this.shiftFirestore.deleteShift(shiftObj.shiftId);
        }
      }   
    })
    this.notifier.showNotification('User deleted!', 'OK', 'success', 'top');
    this.showSpinner = false;
    this.router.navigate(['home']);
  }

  filterShifts() {
    this.shiftFirestore.setUserIdShidfts(this.clickedRow.userId);
    this.router.navigate(['allShifts']);
  }

  update() {
    this.showSpinner = true;
    if (this.editForm.invalid) {
      return;
    }

    let email = this.editForm.value['email'];
    let password = this.editForm.value['password'];
    let firstName = this.editForm.value['firstName'];
    let lastName = this.editForm.value['lastName'];
    let birthDate = this.editForm.value['birthDate'].getTime();
    let username = this.editForm.value['username'];
     
      let user: User = {
        firstName,
        lastName,
        password,
        username,
        birthDate,
        email
      };

      this.fireService.updateUser(this.clickedRow.userId, user);
      this.notifier.showNotification("Worker updated!","OK","success","top");
      this.showSpinner = false;
      // this.fireService.clickUserRow(null);
      // this.authService.SignUp(email, password).subscribe((data) => {
      //   this.showSpinner = false;
      // });
      this.router.navigate(['home']);
   
  }

  ngOnInit(): void {
    this.clickedRow = this.fireService.getUserRow();
    this.fireService.getUsers().subscribe((data) => {
    this.Users = [];
    data.map((a) => {
        let user = a.payload.doc.data();
        let userID = a.payload.doc.id;
        this.Users.push({ user, userID });
      });
      
      let userToEdit = this.Users.find((x) => {
        return x.userID === this.clickedRow.userId;
      });
      if (userToEdit != undefined){
      this.editForm.controls['email'].setValue(userToEdit['user']['email']);
      this.editForm.controls['password'].setValue(
        userToEdit['user']['password']
      );
      this.editForm.controls['passwordConf'].setValue(
        userToEdit['user']['password']
      );
      this.editForm.controls['firstName'].setValue(
        userToEdit['user']['firstName']
      );
      this.editForm.controls['lastName'].setValue(
        userToEdit['user']['lastName']
      );
      let userBirthDate = new Date(userToEdit['user']['birthDate']);
      this.editForm.controls['birthDate'].setValue(userBirthDate);
      this.editForm.controls['username'].setValue(
        userToEdit['user']['username']
      );}
    });
  }
}
