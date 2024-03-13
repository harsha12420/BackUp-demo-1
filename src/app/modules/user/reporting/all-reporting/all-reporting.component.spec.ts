import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllReportingComponent } from './all-reporting.component';

describe('AllReportingComponent', () => {
  let component: AllReportingComponent;
  let fixture: ComponentFixture<AllReportingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AllReportingComponent]
    });
    fixture = TestBed.createComponent(AllReportingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
