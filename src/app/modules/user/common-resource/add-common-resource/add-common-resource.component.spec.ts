import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCommonResourceComponent } from './add-common-resource.component';

describe('AddCommonResourceComponent', () => {
  let component: AddCommonResourceComponent;
  let fixture: ComponentFixture<AddCommonResourceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddCommonResourceComponent]
    });
    fixture = TestBed.createComponent(AddCommonResourceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
