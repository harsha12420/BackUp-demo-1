import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SubjectWiseLessonPlanningRoutingModule } from './subject-wise-lesson-planning-routing.module';
import { AddSubjectWiseLessonPlanningComponent } from './add-subject-wise-lesson-planning/add-subject-wise-lesson-planning.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { AddLessonPlanningComponent } from './add-lesson-planning/add-lesson-planning.component';
import { DragDropModule } from '@angular/cdk/drag-drop';


@NgModule({
  declarations: [
    AddSubjectWiseLessonPlanningComponent,
    AddLessonPlanningComponent
  ],
  imports: [
    CommonModule,
    SubjectWiseLessonPlanningRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    NgbModule,
    FormsModule,
    NgSelectModule,
    DragDropModule
  ]
})
export class SubjectWiseLessonPlanningModule { }
