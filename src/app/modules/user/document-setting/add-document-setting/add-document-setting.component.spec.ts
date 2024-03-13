import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDocumentSettingComponent } from './add-document-setting.component';

describe('AddDocumentSettingComponent', () => {
  let component: AddDocumentSettingComponent;
  let fixture: ComponentFixture<AddDocumentSettingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddDocumentSettingComponent]
    });
    fixture = TestBed.createComponent(AddDocumentSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
