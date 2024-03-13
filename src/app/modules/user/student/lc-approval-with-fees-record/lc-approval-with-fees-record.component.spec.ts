import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LcApprovalWithFeesRecordComponent } from './lc-approval-with-fees-record.component';

describe('LcApprovalWithFeesRecordComponent', () => {
  let component: LcApprovalWithFeesRecordComponent;
  let fixture: ComponentFixture<LcApprovalWithFeesRecordComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LcApprovalWithFeesRecordComponent]
    });
    fixture = TestBed.createComponent(LcApprovalWithFeesRecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
