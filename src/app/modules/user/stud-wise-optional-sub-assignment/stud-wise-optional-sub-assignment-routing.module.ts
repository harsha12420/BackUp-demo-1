import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StudOptionalSubAssignmentComponent } from './stud-optional-sub-assignment/stud-optional-sub-assignment.component';

const routes: Routes = [
  {
    path: '',
    component: StudOptionalSubAssignmentComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StudWiseOptionalSubAssignmentRoutingModule { }
