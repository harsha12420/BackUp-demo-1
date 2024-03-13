import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeeHeadAndGroupMappingComponent } from './fee-head-and-group-mapping.component';

describe('FeeHeadAndGroupMappingComponent', () => {
  let component: FeeHeadAndGroupMappingComponent;
  let fixture: ComponentFixture<FeeHeadAndGroupMappingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FeeHeadAndGroupMappingComponent]
    });
    fixture = TestBed.createComponent(FeeHeadAndGroupMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
