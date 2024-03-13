import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SubjectCategoryRoutingModule } from './subject-category-routing.module';
import { AddSubjectCategoryComponent } from './add-subject-category/add-subject-category.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';


@NgModule({
  declarations: [
    AddSubjectCategoryComponent
  ],
  imports: [
    CommonModule,
    SubjectCategoryRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    NgbModule,
    FormsModule,
    NgSelectModule,
  ]
})
export class SubjectCategoryModule { }
