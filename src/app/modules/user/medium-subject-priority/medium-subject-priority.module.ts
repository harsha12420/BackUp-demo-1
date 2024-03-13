import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MediumSubjectPriorityRoutingModule } from './medium-subject-priority-routing.module';
import { AddSubjectPriorityComponent } from './add-subject-priority/add-subject-priority.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { DragDropModule } from '@angular/cdk/drag-drop';

@NgModule({
  declarations: [
    AddSubjectPriorityComponent
  ],
  imports: [
    CommonModule,
    MediumSubjectPriorityRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    NgbModule,
    FormsModule,
    NgSelectModule,
    DragDropModule
  ]
})
export class MediumSubjectPriorityModule { }
