import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SourceOfInformationComponent } from './source-of-information.component';

describe('SourceOfInformationComponent', () => {
  let component: SourceOfInformationComponent;
  let fixture: ComponentFixture<SourceOfInformationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SourceOfInformationComponent]
    });
    fixture = TestBed.createComponent(SourceOfInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
