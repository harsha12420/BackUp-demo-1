import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StandardDocumentComponent } from './standard-document.component';

describe('StandardDocumentComponent', () => {
  let component: StandardDocumentComponent;
  let fixture: ComponentFixture<StandardDocumentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StandardDocumentComponent]
    });
    fixture = TestBed.createComponent(StandardDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
