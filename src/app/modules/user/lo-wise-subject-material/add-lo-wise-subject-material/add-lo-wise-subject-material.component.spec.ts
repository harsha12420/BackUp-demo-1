import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddLoWiseSubjectMaterialComponent } from './add-lo-wise-subject-material.component';

describe('AddLoWiseSubjectMaterialComponent', () => {
  let component: AddLoWiseSubjectMaterialComponent;
  let fixture: ComponentFixture<AddLoWiseSubjectMaterialComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddLoWiseSubjectMaterialComponent]
    });
    fixture = TestBed.createComponent(AddLoWiseSubjectMaterialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
