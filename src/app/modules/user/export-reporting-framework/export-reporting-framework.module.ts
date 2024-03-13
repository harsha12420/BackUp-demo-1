import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExportReportingFrameworkRoutingModule } from './export-reporting-framework-routing.module';
import { AddExportReportingFrameworkComponent } from './add-export-reporting-framework/add-export-reporting-framework.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
  declarations: [AddExportReportingFrameworkComponent],
  imports: [
    CommonModule,
    ExportReportingFrameworkRoutingModule,
    ReactiveFormsModule,
    NgbModule,
    SharedModule,
    FormsModule,
    NgSelectModule,
  ],
})
export class ExportReportingFrameworkModule {}
