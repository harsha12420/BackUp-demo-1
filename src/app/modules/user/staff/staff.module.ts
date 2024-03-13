import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StaffRoutingModule } from './staff-routing.module';
import { AddStaffComponent } from './add-staff/add-staff.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { AddProcessStaffComponent } from './add-process-staff/add-process-staff.component';
import { MatStepperModule } from '@angular/material/stepper';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ViewStaffComponent } from './view-staff/view-staff.component';

@NgModule({
  declarations: [AddStaffComponent, AddProcessStaffComponent, ViewStaffComponent],
  imports: [
    CommonModule,
    StaffRoutingModule,
    NgbModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule,
    NgSelectModule,
    MatStepperModule,
    NgxDropzoneModule,
    BsDatepickerModule
  ],
})
export class StaffModule { }
