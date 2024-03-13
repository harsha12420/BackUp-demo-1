import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {  RazorpayRoutingModule } from './razorpay-routing.module';
import {  TestRazorpayComponent } from './test-razorpay/test-razorpay.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    TestRazorpayComponent
  ],
  imports: [
    CommonModule,
    RazorpayRoutingModule,
    SharedModule,
    FormsModule
  ]
})
export class RazorpayModule { }
