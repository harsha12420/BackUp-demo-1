import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddSubjectMaterialTypeComponent } from './add-subject-material-type/add-subject-material-type.component';

const routes: Routes = [{
  path: "",
  component: AddSubjectMaterialTypeComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SubjectMaterialTypeRoutingModule { }
