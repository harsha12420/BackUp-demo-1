import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddSubjectCategoryComponent } from './add-subject-category/add-subject-category.component';

const routes: Routes = [
  {
    path: '',
    component: AddSubjectCategoryComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SubjectCategoryRoutingModule { }
