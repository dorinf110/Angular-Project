import { NgModule, APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { initializeApp,provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { provideAuth,getAuth } from '@angular/fire/auth';
import { provideDatabase,getDatabase } from '@angular/fire/database';
import { provideFirestore,getFirestore } from '@angular/fire/firestore';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material/material.module';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { NotifierComponent } from './components/notifier/notifier.component';
import { DatePipe } from '@angular/common';
import { NavbarComponent } from './components/navbar/navbar.component';
import { AddshiftComponent } from './components/addshift/addshift.component';
import { MyshiftsComponent } from './components/myshifts/myshifts.component';
import { EditpComponent } from './components/editp/editp.component';
import { WeekShiftsComponent } from './components/week-shifts/week-shifts.component';
import { EditShiftComponent } from './components/edit-shift/edit-shift.component';
import { MAT_DATE_LOCALE } from '@angular/material/core';



@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    NotifierComponent,
    NavbarComponent,
    AddshiftComponent,
    MyshiftsComponent,
    EditpComponent,
    WeekShiftsComponent,
    EditShiftComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideDatabase(() => getDatabase()),
    provideFirestore(() => getFirestore()),
    BrowserAnimationsModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    MatNativeDateModule
  ],
  providers: [DatePipe, { provide: MAT_DATE_LOCALE, useValue: 'ro-RO' }],
  bootstrap: [AppComponent]
})
export class AppModule {}
