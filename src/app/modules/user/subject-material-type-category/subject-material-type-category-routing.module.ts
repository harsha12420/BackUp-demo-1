import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddSubjectMaterialTypeCategoryComponent } from './add-subject-material-type-category/add-subject-material-type-category.component';

const routes: Routes = [{
  path: '',
  component: AddSubjectMaterialTypeCategoryComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SubjectMaterialTypeCategoryRoutingModule { }
