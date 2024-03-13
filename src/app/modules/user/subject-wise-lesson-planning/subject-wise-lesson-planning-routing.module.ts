import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddSubjectWiseLessonPlanningComponent } from './add-subject-wise-lesson-planning/add-subject-wise-lesson-planning.component';
import { AddLessonPlanningComponent } from './add-lesson-planning/add-lesson-planning.component';

const routes: Routes = [
  { 
    path : '',
    component: AddSubjectWiseLessonPlanningComponent
  },
  {
    path: 'add-lesson-planning',
    component: AddLessonPlanningComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SubjectWiseLessonPlanningRoutingModule { }
