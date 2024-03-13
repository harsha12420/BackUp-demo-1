import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddProcessLoWiseSubjectMaterialComponent } from './add-process-lo-wise-subject-material.component';

describe('AddProcessLoWiseSubjectMaterialComponent', () => {
  let component: AddProcessLoWiseSubjectMaterialComponent;
  let fixture: ComponentFixture<AddProcessLoWiseSubjectMaterialComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddProcessLoWiseSubjectMaterialComponent]
    });
    fixture = TestBed.createComponent(AddProcessLoWiseSubjectMaterialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
