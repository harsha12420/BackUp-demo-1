import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddObservationRelatedToComponent } from './add-observation-related-to/add-observation-related-to.component';

const routes: Routes = [
  {
    path: '',
    component: AddObservationRelatedToComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ObservationRelatedToRoutingModule {}
