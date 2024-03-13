import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddObservationWorkingAreaComponent } from './add-observation-working-area/add-observation-working-area.component';

const routes: Routes = [
  {
    path: '',
    component: AddObservationWorkingAreaComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ObservationWorkingAreaRoutingModule {}
