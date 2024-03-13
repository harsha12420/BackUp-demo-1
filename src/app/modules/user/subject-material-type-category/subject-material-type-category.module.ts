import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SubjectMaterialTypeCategoryRoutingModule } from './subject-material-type-category-routing.module';
import { AddSubjectMaterialTypeCategoryComponent } from './add-subject-material-type-category/add-subject-material-type-category.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgSelectModule } from '@ng-select/ng-select';


@NgModule({
  declarations: [
    AddSubjectMaterialTypeCategoryComponent
  ],
  imports: [
    CommonModule,
    SubjectMaterialTypeCategoryRoutingModule,
    ReactiveFormsModule,
    NgbModule,
    SharedModule,
    FormsModule,
    NgSelectModule,
  ]
})
export class SubjectMaterialTypeCategoryModule { }
