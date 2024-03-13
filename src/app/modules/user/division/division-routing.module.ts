import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddDivisionComponent } from './add-division/add-division.component';

const routes: Routes = [
  {
    path: '',
    component: AddDivisionComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DivisionRoutingModule { }
