import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddLeaveSetingComponent } from './add-leave-seting/add-leave-seting.component';

const routes: Routes = [{
  path: "",
  component: AddLeaveSetingComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LeaveSettingRoutingModule { }
