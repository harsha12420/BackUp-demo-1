import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SubjectMaterialTypeRoutingModule } from './subject-material-type-routing.module';
import { AddSubjectMaterialTypeComponent } from './add-subject-material-type/add-subject-material-type.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgxDropzoneModule } from 'ngx-dropzone';


@NgModule({
  declarations: [
    AddSubjectMaterialTypeComponent
  ],
  imports: [
    CommonModule,
    SubjectMaterialTypeRoutingModule,
    ReactiveFormsModule,
    NgbModule,
    SharedModule,
    FormsModule,
    NgxDropzoneModule
  ]
})
export class SubjectMaterialTypeModule { }
