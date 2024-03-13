import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddWorkCategoryComponent } from './add-work-category/add-work-category.component';

const routes: Routes = [
  {
    path: '',
    component: AddWorkCategoryComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WorkCategoryRoutingModule { }
