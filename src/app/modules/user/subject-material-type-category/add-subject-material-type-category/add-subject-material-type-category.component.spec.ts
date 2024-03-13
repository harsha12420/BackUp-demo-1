import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSubjectMaterialTypeCategoryComponent } from './add-subject-material-type-category.component';

describe('AddSubjectMaterialTypeCategoryComponent', () => {
  let component: AddSubjectMaterialTypeCategoryComponent;
  let fixture: ComponentFixture<AddSubjectMaterialTypeCategoryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddSubjectMaterialTypeCategoryComponent]
    });
    fixture = TestBed.createComponent(AddSubjectMaterialTypeCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
