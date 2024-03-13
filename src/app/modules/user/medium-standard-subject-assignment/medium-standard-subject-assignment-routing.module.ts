import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SubjectAssignmentComponent } from './subject-assignment/subject-assignment.component';

const routes: Routes = [
  {
    path: '',
    component: SubjectAssignmentComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MediumStandardSubjectAssignmentRoutingModule { }
