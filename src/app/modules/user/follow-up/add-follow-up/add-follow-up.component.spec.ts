import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddFollowUpComponent } from './add-follow-up.component';

describe('AddFollowUpComponent', () => {
  let component: AddFollowUpComponent;
  let fixture: ComponentFixture<AddFollowUpComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddFollowUpComponent]
    });
    fixture = TestBed.createComponent(AddFollowUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
