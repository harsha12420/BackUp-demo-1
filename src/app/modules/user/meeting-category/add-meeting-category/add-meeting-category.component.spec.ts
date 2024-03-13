import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMeetingCategoryComponent } from './add-meeting-category.component';

describe('AddMeetingCategoryComponent', () => {
  let component: AddMeetingCategoryComponent;
  let fixture: ComponentFixture<AddMeetingCategoryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddMeetingCategoryComponent]
    });
    fixture = TestBed.createComponent(AddMeetingCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
