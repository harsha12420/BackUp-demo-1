import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddAreaComponent } from './add-area/add-area.component';

const routes: Routes = [
  {
    path: '',
    component: AddAreaComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AreaRoutingModule {}
