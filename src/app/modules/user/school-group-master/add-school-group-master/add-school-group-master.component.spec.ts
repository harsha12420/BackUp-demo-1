import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSchoolGroupMasterComponent } from './add-school-group-master.component';

describe('AddSchoolGroupMasterComponent', () => {
  let component: AddSchoolGroupMasterComponent;
  let fixture: ComponentFixture<AddSchoolGroupMasterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddSchoolGroupMasterComponent]
    });
    fixture = TestBed.createComponent(AddSchoolGroupMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
