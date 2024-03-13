import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeadGroupMasterComponent } from './head-group-master.component';

describe('HeadGroupMasterComponent', () => {
  let component: HeadGroupMasterComponent;
  let fixture: ComponentFixture<HeadGroupMasterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HeadGroupMasterComponent]
    });
    fixture = TestBed.createComponent(HeadGroupMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
