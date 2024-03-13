import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddReportingCutOffComponent } from './add-reporting-cut-off.component';

describe('AddReportingCutOffComponent', () => {
  let component: AddReportingCutOffComponent;
  let fixture: ComponentFixture<AddReportingCutOffComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddReportingCutOffComponent]
    });
    fixture = TestBed.createComponent(AddReportingCutOffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
