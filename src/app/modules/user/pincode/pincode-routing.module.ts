import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddPincodeComponent } from './add-pincode/add-pincode.component';

const routes: Routes = [
  {
    path: '',
    component: AddPincodeComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PincodeRoutingModule { }
