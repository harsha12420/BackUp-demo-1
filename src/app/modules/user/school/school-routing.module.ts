import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddSchoolComponent } from './add-school/add-school.component';

const routes: Routes = [{
  path: '', component:AddSchoolComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SchoolRoutingModule { }
