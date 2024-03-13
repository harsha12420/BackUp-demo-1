import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddWorkStatusComponent } from './add-work-status/add-work-status.component';

const routes: Routes = [
  {
    path: '',
    component: AddWorkStatusComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WorkStatusRoutingModule { }
