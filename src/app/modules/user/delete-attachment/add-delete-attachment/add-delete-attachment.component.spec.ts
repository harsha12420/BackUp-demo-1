import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDeleteAttachmentComponent } from './add-delete-attachment.component';

describe('AddDeleteAttachmentComponent', () => {
  let component: AddDeleteAttachmentComponent;
  let fixture: ComponentFixture<AddDeleteAttachmentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddDeleteAttachmentComponent]
    });
    fixture = TestBed.createComponent(AddDeleteAttachmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
