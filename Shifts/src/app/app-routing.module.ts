import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { AddshiftComponent } from './components/addshift/addshift.component';
import { MyshiftsComponent } from './components/myshifts/myshifts.component';
import { EditpComponent } from './components/editp/editp.component';
import { EditShiftComponent } from './components/edit-shift/edit-shift.component';

const routes: Routes = [
  {path:'',redirectTo:'register',pathMatch:'full'},
  {path:'register',component:RegisterComponent},
  {path:'login',component:LoginComponent},
  {path:'home',component:HomeComponent},
  {path:'addShift',component:AddshiftComponent},
  {path:'myShifts',component:MyshiftsComponent},
  {path:'edit',component:EditpComponent},
  {path:'edit-shift', component:EditShiftComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
