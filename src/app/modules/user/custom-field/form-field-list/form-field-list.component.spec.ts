import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormFieldListComponent } from './form-field-list.component';

describe('FormFieldListComponent', () => {
  let component: FormFieldListComponent;
  let fixture: ComponentFixture<FormFieldListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FormFieldListComponent]
    });
    fixture = TestBed.createComponent(FormFieldListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
