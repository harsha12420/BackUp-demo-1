import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddReportingCutOffComponent } from './add-reporting-cut-off/add-reporting-cut-off.component';

const routes: Routes = [
  {
    path: 'cut-off',
    component: AddReportingCutOffComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportingCutOffRoutingModule { }
