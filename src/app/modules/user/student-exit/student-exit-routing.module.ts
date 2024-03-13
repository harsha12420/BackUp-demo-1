import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LeaveMasterComponent } from './leave-master/leave-master.component';

const routes: Routes = [
  {
    path: '',
    component: LeaveMasterComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StudentExitRoutingModule { }
