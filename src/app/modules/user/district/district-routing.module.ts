import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddDistrictComponent } from './add-district/add-district.component';

const routes: Routes = [
  {
    path: '',
    component: AddDistrictComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DistrictRoutingModule {}
