import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddWorkStatusComponent } from './add-work-status.component';

describe('AddWorkStatusComponent', () => {
  let component: AddWorkStatusComponent;
  let fixture: ComponentFixture<AddWorkStatusComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddWorkStatusComponent]
    });
    fixture = TestBed.createComponent(AddWorkStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
