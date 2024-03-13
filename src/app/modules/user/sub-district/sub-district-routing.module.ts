import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddSubDistrictComponent } from './add-sub-district/add-sub-district.component';

const routes: Routes = [
  {
    path: '',
    component: AddSubDistrictComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SubDistrictRoutingModule {}
