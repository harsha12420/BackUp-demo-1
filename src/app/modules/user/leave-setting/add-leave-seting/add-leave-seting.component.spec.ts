import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddLeaveSetingComponent } from './add-leave-seting.component';

describe('AddLeaveSetingComponent', () => {
  let component: AddLeaveSetingComponent;
  let fixture: ComponentFixture<AddLeaveSetingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddLeaveSetingComponent]
    });
    fixture = TestBed.createComponent(AddLeaveSetingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
