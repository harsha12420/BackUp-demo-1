import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddRouteComponent } from './add-route/add-route.component';

const routes: Routes = [
  {
    path: '',
    component: AddRouteComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RouteRoutingModule { }
