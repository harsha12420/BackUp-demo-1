import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDivisionComponent } from './add-division.component';

describe('AddDivisionComponent', () => {
  let component: AddDivisionComponent;
  let fixture: ComponentFixture<AddDivisionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddDivisionComponent]
    });
    fixture = TestBed.createComponent(AddDivisionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
