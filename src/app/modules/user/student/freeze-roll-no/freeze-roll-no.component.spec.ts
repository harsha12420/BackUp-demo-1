import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FreezeRollNoComponent } from './freeze-roll-no.component';

describe('FreezeRollNoComponent', () => {
  let component: FreezeRollNoComponent;
  let fixture: ComponentFixture<FreezeRollNoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FreezeRollNoComponent]
    });
    fixture = TestBed.createComponent(FreezeRollNoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
