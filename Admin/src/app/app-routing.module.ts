import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { AllShiftsComponent } from './components/all-shifts/all-shifts.component';
import { AllWorkersComponent } from './components/all-workers/all-workers.component';
import { EditShiftComponent } from './components/edit-shift/edit-shift.component';
import { EditProfileComponent } from './components/edit-profile/edit-profile.component';

const routes: Routes = [
  {path:'',redirectTo:'register',pathMatch:'full'},
  {path:'allShifts',component:AllShiftsComponent},
  {path:'allWorkers',component:AllWorkersComponent},
  {path:'register',component:RegisterComponent},
  {path:'login',component:LoginComponent},
  {path:'home',component:HomeComponent},
  {path:'edit-shift', component:EditShiftComponent},
  {path:'edit-profile', component:EditProfileComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
