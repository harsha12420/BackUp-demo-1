import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditChangePasswordComponent } from './edit-change-password.component';

describe('EditChangePasswordComponent', () => {
  let component: EditChangePasswordComponent;
  let fixture: ComponentFixture<EditChangePasswordComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditChangePasswordComponent]
    });
    fixture = TestBed.createComponent(EditChangePasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
