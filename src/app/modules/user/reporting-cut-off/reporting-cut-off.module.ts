import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportingCutOffRoutingModule } from './reporting-cut-off-routing.module';
import { AddReportingCutOffComponent } from './add-reporting-cut-off/add-reporting-cut-off.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { UtcToDatePipe } from 'src/app/shared/data/customPipes/utcTolocal';

@NgModule({
  declarations: [AddReportingCutOffComponent, UtcToDatePipe],
  imports: [
    CommonModule,
    ReportingCutOffRoutingModule,
    ReactiveFormsModule,
    NgbModule,
    SharedModule,
    FormsModule,
    NgSelectModule,
    TimepickerModule.forRoot(),
  ],
})
export class ReportingCutOffModule {}
