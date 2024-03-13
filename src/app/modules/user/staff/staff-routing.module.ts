import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddStaffComponent } from './add-staff/add-staff.component';
import { AddProcessStaffComponent } from './add-process-staff/add-process-staff.component';
import { ViewStaffComponent } from './view-staff/view-staff.component';

const routes: Routes = [
  {
    path: '',
    component: AddStaffComponent,
  },
  {
    path: 'add-staff',
    component: AddProcessStaffComponent,
  },
  {
    path: 'view-staff/:id',
    component: ViewStaffComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StaffRoutingModule { }
