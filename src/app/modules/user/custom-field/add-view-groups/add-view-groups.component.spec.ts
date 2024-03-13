import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddViewGroupsComponent } from './add-view-groups.component';

describe('AddViewGroupsComponent', () => {
  let component: AddViewGroupsComponent;
  let fixture: ComponentFixture<AddViewGroupsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddViewGroupsComponent]
    });
    fixture = TestBed.createComponent(AddViewGroupsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
