import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FeeCategoryComponent } from './fee-category.component';

const routes: Routes = [
  {
    path: '',
    component: FeeCategoryComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FeeCategoryRoutingModule { }
