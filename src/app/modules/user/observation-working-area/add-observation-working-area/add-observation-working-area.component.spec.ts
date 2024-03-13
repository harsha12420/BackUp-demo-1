import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddObservationWorkingAreaComponent } from './add-observation-working-area.component';

describe('AddObservationWorkingAreaComponent', () => {
  let component: AddObservationWorkingAreaComponent;
  let fixture: ComponentFixture<AddObservationWorkingAreaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddObservationWorkingAreaComponent]
    });
    fixture = TestBed.createComponent(AddObservationWorkingAreaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
