import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddProcessStaffComponent } from './add-process-staff.component';

describe('AddProcessStaffComponent', () => {
  let component: AddProcessStaffComponent;
  let fixture: ComponentFixture<AddProcessStaffComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddProcessStaffComponent]
    });
    fixture = TestBed.createComponent(AddProcessStaffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
