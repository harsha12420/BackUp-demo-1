import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcademicYearValidationComponent } from './academic-year-validation.component';

describe('AcademicYearValidationComponent', () => {
  let component: AcademicYearValidationComponent;
  let fixture: ComponentFixture<AcademicYearValidationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AcademicYearValidationComponent]
    });
    fixture = TestBed.createComponent(AcademicYearValidationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
