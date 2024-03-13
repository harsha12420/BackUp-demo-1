import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WorkCategoryRoutingModule } from './work-category-routing.module';
import { AddWorkCategoryComponent } from './add-work-category/add-work-category.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [AddWorkCategoryComponent],
  imports: [
    CommonModule,
    WorkCategoryRoutingModule,
    ReactiveFormsModule,
    NgbModule,
    SharedModule,
    FormsModule,
  ],
})
export class WorkCategoryModule {}
