import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddVilageComponent } from './add-vilage.component';

describe('AddVilageComponent', () => {
  let component: AddVilageComponent;
  let fixture: ComponentFixture<AddVilageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddVilageComponent]
    });
    fixture = TestBed.createComponent(AddVilageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
