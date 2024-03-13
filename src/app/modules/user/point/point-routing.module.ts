import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddPointComponent } from './add-point/add-point.component';

const routes: Routes = [
  {
    path: '',
    component: AddPointComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PointRoutingModule {}
