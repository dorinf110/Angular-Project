import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { User } from '../interfaces/user';
import { NotifierService } from './notifier.service';



@Injectable({
  providedIn: 'root'
})
export class UserServiceFirestoreService {

  constructor(public firestore:AngularFirestore, private notifier:NotifierService) { }

  allUsers:any[];
  userRow:{userId:string, firstName:string, lastName:string, birthDate:string, password:string, passwordConf:string, email:string};

 public getUsers(){
    return this.firestore.collection('users').snapshotChanges();
  }
  
  public getAdmins(){
    return this.firestore.collection('admins').snapshotChanges();
  } 

  public saveUser(user:User){
    this.firestore.collection('users').add(user).then(document=>{
      // console.log("user added:", document);
    }).catch(error=>{
      console.log(error);
    });
  }

  public saveAdmin(user:User){
    this.firestore.collection('admins').add(user).then(document=>{
      }).catch(error=>{
      console.log(error);
    });
  }

  public updateUser(id:string, user:User){
    const document = this.firestore.collection('users').doc(id);
     document.update(user).then(data=>{
      }).catch(error=>{
      this.notifier.showNotification(error,"OK","error","bottom");
    });
  }

  public deleteUser(id:string){
    const document= this.firestore.collection('users').doc(id);
    document.delete().catch(error=>{
      console.log(error);
  })}

  public setAllUsers(value){
    this.allUsers = value;
  }

  public getAllUsers(){
    return this.allUsers;
  }

  public clickUserRow(value:{userId:string, firstName:string, lastName:string, birthDate:string, password:string, passwordConf:string, email:string}){
    this.userRow=value;
  }

  public getUserRow(){
    return this.userRow;
  }
}
