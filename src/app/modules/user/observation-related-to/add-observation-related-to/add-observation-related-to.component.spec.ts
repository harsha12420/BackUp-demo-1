import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddObservationRelatedToComponent } from './add-observation-related-to.component';

describe('AddObservationRelatedToComponent', () => {
  let component: AddObservationRelatedToComponent;
  let fixture: ComponentFixture<AddObservationRelatedToComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddObservationRelatedToComponent]
    });
    fixture = TestBed.createComponent(AddObservationRelatedToComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
