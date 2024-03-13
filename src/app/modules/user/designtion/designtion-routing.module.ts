import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddDesigntionComponent } from './add-designtion/add-designtion.component';

const routes: Routes = [
  {
    path: '',
    component: AddDesigntionComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DesigntionRoutingModule {}
