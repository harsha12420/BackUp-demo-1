import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportingRoutingModule } from './reporting-routing.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { SharedModule } from 'src/app/shared/shared.module';
import { AllReportingComponent } from './all-reporting/all-reporting.component';
import { ReportingStatisticsComponent } from './reporting-statistics/reporting-statistics.component';
import { NgxDropzoneModule } from 'ngx-dropzone';


@NgModule({
  declarations: [
    AllReportingComponent,
    ReportingStatisticsComponent,
  ],
  imports: [
    CommonModule,
    ReportingRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    NgbModule,
    FormsModule,
    NgSelectModule,
    NgxDropzoneModule,
  ]
})
export class ReportingModule { }
