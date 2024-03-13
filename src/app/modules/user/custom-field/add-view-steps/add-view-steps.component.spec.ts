import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddViewStepsComponent } from './add-view-steps.component';

describe('AddViewStepsComponent', () => {
  let component: AddViewStepsComponent;
  let fixture: ComponentFixture<AddViewStepsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddViewStepsComponent]
    });
    fixture = TestBed.createComponent(AddViewStepsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
