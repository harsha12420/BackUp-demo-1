import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddHolidayComponent } from './add-holiday.component';

describe('AddHolidayComponent', () => {
  let component: AddHolidayComponent;
  let fixture: ComponentFixture<AddHolidayComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddHolidayComponent]
    });
    fixture = TestBed.createComponent(AddHolidayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
