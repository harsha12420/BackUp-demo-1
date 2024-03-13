import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddCommonResourceComponent } from './add-common-resource/add-common-resource.component';

const routes: Routes = [
  {
    path: '',
    component: AddCommonResourceComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CommonResourceRoutingModule {}
