import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StdCategoryWiseMappingComponent } from './std-category-wise-mapping.component';

describe('StdCategoryWiseMappingComponent', () => {
  let component: StdCategoryWiseMappingComponent;
  let fixture: ComponentFixture<StdCategoryWiseMappingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StdCategoryWiseMappingComponent]
    });
    fixture = TestBed.createComponent(StdCategoryWiseMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
