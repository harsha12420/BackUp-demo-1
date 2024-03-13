import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddStaffRoomComponent } from './add-staff-room.component';

describe('AddStaffRoomComponent', () => {
  let component: AddStaffRoomComponent;
  let fixture: ComponentFixture<AddStaffRoomComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddStaffRoomComponent]
    });
    fixture = TestBed.createComponent(AddStaffRoomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
