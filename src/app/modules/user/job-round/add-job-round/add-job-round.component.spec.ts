import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddJobRoundComponent } from './add-job-round.component';

describe('AddJobRoundComponent', () => {
  let component: AddJobRoundComponent;
  let fixture: ComponentFixture<AddJobRoundComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddJobRoundComponent]
    });
    fixture = TestBed.createComponent(AddJobRoundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
