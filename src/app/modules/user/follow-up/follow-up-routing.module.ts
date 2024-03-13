import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddFollowUpComponent } from './add-follow-up/add-follow-up.component';

const routes: Routes = [
  {
    path: '',
    component: AddFollowUpComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FollowUpRoutingModule { }
