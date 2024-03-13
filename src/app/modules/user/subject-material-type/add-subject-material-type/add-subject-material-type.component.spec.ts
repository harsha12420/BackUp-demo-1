import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSubjectMaterialTypeComponent } from './add-subject-material-type.component';

describe('AddSubjectMaterialTypeComponent', () => {
  let component: AddSubjectMaterialTypeComponent;
  let fixture: ComponentFixture<AddSubjectMaterialTypeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddSubjectMaterialTypeComponent]
    });
    fixture = TestBed.createComponent(AddSubjectMaterialTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
