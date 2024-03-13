import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddExportReportingFrameworkComponent } from './add-export-reporting-framework/add-export-reporting-framework.component';

const routes: Routes = [
  {
    path: 'framework',
    component: AddExportReportingFrameworkComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExportReportingFrameworkRoutingModule { }
