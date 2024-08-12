import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'shifts';

  routerOutletComponent: object;
  routerOutletComponentClassName: string;
  showCredit:boolean=true;

  onActivate(event: any): void {
    
    if(event.constructor.name === "RegisterComponent" || event.constructor.name === "LoginComponent"){
      this.showCredit=false;
    } else {
      this.showCredit=true;
    }
  }
}
