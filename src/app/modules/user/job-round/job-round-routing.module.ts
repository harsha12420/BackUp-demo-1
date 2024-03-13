import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddJobRoundComponent } from './add-job-round/add-job-round.component';

const routes: Routes = [
  {
    path: '',
    component: AddJobRoundComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class JobRoundRoutingModule {}
