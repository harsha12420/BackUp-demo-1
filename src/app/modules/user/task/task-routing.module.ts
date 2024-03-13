import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddTaskCategoryComponent } from './add-task-category/add-task-category.component';

const routes: Routes = [
  {
    path: '',
    component: AddTaskCategoryComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TaskRoutingModule { }
