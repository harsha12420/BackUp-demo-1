import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddWorkCategoryComponent } from './add-work-category.component';

describe('AddWorkCategoryComponent', () => {
  let component: AddWorkCategoryComponent;
  let fixture: ComponentFixture<AddWorkCategoryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddWorkCategoryComponent]
    });
    fixture = TestBed.createComponent(AddWorkCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
