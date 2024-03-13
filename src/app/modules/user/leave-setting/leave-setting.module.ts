import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LeaveSettingRoutingModule } from './leave-setting-routing.module';
import { AddLeaveSetingComponent } from './add-leave-seting/add-leave-seting.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    AddLeaveSetingComponent
  ],
  imports: [
    CommonModule,
    LeaveSettingRoutingModule,
    SharedModule,
    ReactiveFormsModule
  ]
})
export class LeaveSettingModule { }
