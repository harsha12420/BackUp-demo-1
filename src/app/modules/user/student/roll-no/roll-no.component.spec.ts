import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RollNoComponent } from './roll-no.component';

describe('RollNoComponent', () => {
  let component: RollNoComponent;
  let fixture: ComponentFixture<RollNoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RollNoComponent]
    });
    fixture = TestBed.createComponent(RollNoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
