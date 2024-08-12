import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { initializeApp,provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { provideAuth,getAuth } from '@angular/fire/auth';
import { provideFirestore,getFirestore } from '@angular/fire/firestore';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material/material.module';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HomeComponent } from './components/home/home.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { AngularFireModule } from '@angular/fire/compat';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { provideDatabase,getDatabase } from '@angular/fire/database';
// import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { NotifierComponent } from './components/notifier/notifier.component';
import { AllShiftsComponent } from './components/all-shifts/all-shifts.component';
import { AllWorkersComponent } from './components/all-workers/all-workers.component';
import { WeekShiftsComponent } from './components/week-shifts/week-shifts.component';
import { EditShiftComponent } from './components/edit-shift/edit-shift.component';
import { EditProfileComponent } from './components/edit-profile/edit-profile.component';


@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomeComponent,
    RegisterComponent,
    LoginComponent,
    NotifierComponent,
    AllShiftsComponent,
    AllWorkersComponent,
    WeekShiftsComponent,
    EditShiftComponent,
    EditProfileComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideDatabase(() => getDatabase()),
    provideFirestore(() => getFirestore()),
    BrowserAnimationsModule,
    AngularFireModule.initializeApp(environment.firebase),
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    MatNativeDateModule
    ],
  providers: [DatePipe, { provide: MAT_DATE_LOCALE, useValue: 'ro-RO' }],
  bootstrap: [AppComponent]
})
export class AppModule { }
