import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DivisionTransfeComponent } from './division-transfe.component';

describe('DivisionTransfeComponent', () => {
  let component: DivisionTransfeComponent;
  let fixture: ComponentFixture<DivisionTransfeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DivisionTransfeComponent]
    });
    fixture = TestBed.createComponent(DivisionTransfeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
