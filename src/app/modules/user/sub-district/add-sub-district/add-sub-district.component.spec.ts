import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSubDistrictComponent } from './add-sub-district.component';

describe('AddSubDistrictComponent', () => {
  let component: AddSubDistrictComponent;
  let fixture: ComponentFixture<AddSubDistrictComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddSubDistrictComponent]
    });
    fixture = TestBed.createComponent(AddSubDistrictComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
