import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeekShiftsComponent } from './week-shifts.component';

describe('WeekShiftsComponent', () => {
  let component: WeekShiftsComponent;
  let fixture: ComponentFixture<WeekShiftsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WeekShiftsComponent]
    });
    fixture = TestBed.createComponent(WeekShiftsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
