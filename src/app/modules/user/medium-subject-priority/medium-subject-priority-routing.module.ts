import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddSubjectPriorityComponent } from './add-subject-priority/add-subject-priority.component';

const routes: Routes = [
  {
    path: '',
    component: AddSubjectPriorityComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MediumSubjectPriorityRoutingModule { }
