import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DivisionTransferListComponent } from './division-transfer-list.component';

describe('DivisionTransferListComponent', () => {
  let component: DivisionTransferListComponent;
  let fixture: ComponentFixture<DivisionTransferListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DivisionTransferListComponent]
    });
    fixture = TestBed.createComponent(DivisionTransferListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
