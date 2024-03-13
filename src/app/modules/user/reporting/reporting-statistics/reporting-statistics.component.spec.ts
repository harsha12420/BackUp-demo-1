import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportingStatisticsComponent } from './reporting-statistics.component';

describe('ReportingStatisticsComponent', () => {
  let component: ReportingStatisticsComponent;
  let fixture: ComponentFixture<ReportingStatisticsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReportingStatisticsComponent]
    });
    fixture = TestBed.createComponent(ReportingStatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
