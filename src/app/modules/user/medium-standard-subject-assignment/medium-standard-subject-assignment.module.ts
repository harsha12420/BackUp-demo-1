import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MediumStandardSubjectAssignmentRoutingModule } from './medium-standard-subject-assignment-routing.module';
import { SubjectAssignmentComponent } from './subject-assignment/subject-assignment.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';


@NgModule({
  declarations: [
    SubjectAssignmentComponent
  ],
  imports: [
    CommonModule,
    MediumStandardSubjectAssignmentRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    NgbModule,
    FormsModule,
    NgSelectModule
  ]
})
export class MediumStandardSubjectAssignmentModule { }
