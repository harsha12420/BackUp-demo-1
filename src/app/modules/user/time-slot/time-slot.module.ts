import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TimeSlotRoutingModule } from './time-slot-routing.module';
import { AddTimeSoltComponent } from './add-time-solt/add-time-solt.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { NgxDropzoneModule } from 'ngx-dropzone';

@NgModule({
  declarations: [AddTimeSoltComponent],
  imports: [
    CommonModule,
    TimeSlotRoutingModule,
    ReactiveFormsModule,
    NgbModule,
    SharedModule,
    FormsModule,
    NgSelectModule,
    TimepickerModule.forRoot(),
    NgxDropzoneModule,
    BsDatepickerModule.forRoot(),
  ],
})
export class TimeSlotModule {}
