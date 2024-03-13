import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddMediumComponent } from './add-medium/add-medium.component';

const routes: Routes = [
  {
    path: '',
    component: AddMediumComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MediumRoutingModule { }
