import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyshiftsComponent } from './myshifts.component';

describe('MyshiftsComponent', () => {
  let component: MyshiftsComponent;
  let fixture: ComponentFixture<MyshiftsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MyshiftsComponent]
    });
    fixture = TestBed.createComponent(MyshiftsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
