import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddObservationTypeComponent } from './add-observation-type/add-observation-type.component';

const routes: Routes = [
  {
    path: '',
    component: AddObservationTypeComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ObservationTypeRoutingModule {}
