import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {  TestRazorpayComponent } from './test-razorpay/test-razorpay.component';

const routes: Routes = [
  {
    path: '',
    component: TestRazorpayComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RazorpayRoutingModule { }
