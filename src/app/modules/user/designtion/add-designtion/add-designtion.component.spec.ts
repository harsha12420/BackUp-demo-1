import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDesigntionComponent } from './add-designtion.component';

describe('AddDesigntionComponent', () => {
  let component: AddDesigntionComponent;
  let fixture: ComponentFixture<AddDesigntionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddDesigntionComponent]
    });
    fixture = TestBed.createComponent(AddDesigntionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
