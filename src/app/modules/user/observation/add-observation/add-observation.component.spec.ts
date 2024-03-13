import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddObservationComponent } from './add-observation.component';

describe('AddObservationComponent', () => {
  let component: AddObservationComponent;
  let fixture: ComponentFixture<AddObservationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddObservationComponent]
    });
    fixture = TestBed.createComponent(AddObservationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
