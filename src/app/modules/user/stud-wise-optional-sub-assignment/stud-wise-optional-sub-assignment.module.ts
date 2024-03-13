import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StudWiseOptionalSubAssignmentRoutingModule } from './stud-wise-optional-sub-assignment-routing.module';
import { StudOptionalSubAssignmentComponent } from './stud-optional-sub-assignment/stud-optional-sub-assignment.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';


@NgModule({
  declarations: [
    StudOptionalSubAssignmentComponent
  ],
  imports: [
    CommonModule,
    StudWiseOptionalSubAssignmentRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    NgbModule,
    FormsModule,
    NgSelectModule
  ]
})
export class StudWiseOptionalSubAssignmentModule { }