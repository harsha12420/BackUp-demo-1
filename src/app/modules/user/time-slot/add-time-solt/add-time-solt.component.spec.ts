import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTimeSoltComponent } from './add-time-solt.component';

describe('AddTimeSoltComponent', () => {
  let component: AddTimeSoltComponent;
  let fixture: ComponentFixture<AddTimeSoltComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddTimeSoltComponent]
    });
    fixture = TestBed.createComponent(AddTimeSoltComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
