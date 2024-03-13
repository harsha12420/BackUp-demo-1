import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddObservationComponent } from './add-observation/add-observation.component';

const routes: Routes = [
  {
    path: '',
    component: AddObservationComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ObservationRoutingModule { }
