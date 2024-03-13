import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddStandardComponent } from './add-standard/add-standard.component';

const routes: Routes = [
  {
    path: '',
    component: AddStandardComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StandardRoutingModule { }
