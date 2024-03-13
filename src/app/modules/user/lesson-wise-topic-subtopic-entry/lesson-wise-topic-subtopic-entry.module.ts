import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LessonWiseTopicSubtopicEntryRoutingModule } from './lesson-wise-topic-subtopic-entry-routing.module';
import { LessonWiseTopicSubtopicComponent } from './lesson-wise-topic-subtopic/lesson-wise-topic-subtopic.component';
import { AddLessonWiseTopicSubtopicComponent } from './add-lesson-wise-topic-subtopic/add-lesson-wise-topic-subtopic.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { AddSubTopicComponent } from './add-sub-topic/add-sub-topic.component';


@NgModule({
  declarations: [
    LessonWiseTopicSubtopicComponent,
    AddLessonWiseTopicSubtopicComponent,
    AddSubTopicComponent
  ],
  imports: [
    CommonModule,
    LessonWiseTopicSubtopicEntryRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    NgbModule,
    FormsModule,
    NgSelectModule
  ]
})
export class LessonWiseTopicSubtopicEntryModule { }
