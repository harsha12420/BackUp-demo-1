import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddExportReportingFrameworkComponent } from './add-export-reporting-framework.component';

describe('AddExportReportingFrameworkComponent', () => {
  let component: AddExportReportingFrameworkComponent;
  let fixture: ComponentFixture<AddExportReportingFrameworkComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddExportReportingFrameworkComponent]
    });
    fixture = TestBed.createComponent(AddExportReportingFrameworkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
