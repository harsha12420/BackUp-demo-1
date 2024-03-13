import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddSchoolGroupMasterComponent } from './add-school-group-master/add-school-group-master.component';

const routes: Routes = [
  {
    path: '',
    component: AddSchoolGroupMasterComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SchoolGroupMasterRoutingModule { }
