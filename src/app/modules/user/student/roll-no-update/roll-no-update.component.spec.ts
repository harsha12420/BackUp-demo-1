import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RollNoUpdateComponent } from './roll-no-update.component';

describe('RollNoUpdateComponent', () => {
  let component: RollNoUpdateComponent;
  let fixture: ComponentFixture<RollNoUpdateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RollNoUpdateComponent]
    });
    fixture = TestBed.createComponent(RollNoUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
