import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LessonWiseTopicSubtopicComponent } from './lesson-wise-topic-subtopic/lesson-wise-topic-subtopic.component';
import { AddLessonWiseTopicSubtopicComponent } from './add-lesson-wise-topic-subtopic/add-lesson-wise-topic-subtopic.component';
import { AddSubTopicComponent } from './add-sub-topic/add-sub-topic.component';

const routes: Routes = [
  { 
    path : '',
    component: LessonWiseTopicSubtopicComponent
  },
  {
    path: 'add-lesson-planning',
    component: AddLessonWiseTopicSubtopicComponent
  },
  {
    path: 'add-subtopic',
    component: AddSubTopicComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LessonWiseTopicSubtopicEntryRoutingModule { }
