import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormFieldSelectionComponent } from './form-field-selection.component';

describe('FormFieldSelectionComponent', () => {
  let component: FormFieldSelectionComponent;
  let fixture: ComponentFixture<FormFieldSelectionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FormFieldSelectionComponent]
    });
    fixture = TestBed.createComponent(FormFieldSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
