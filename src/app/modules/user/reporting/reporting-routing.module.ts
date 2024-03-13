import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AllReportingComponent } from "./all-reporting/all-reporting.component";
import { ReportingStatisticsComponent } from "./reporting-statistics/reporting-statistics.component";

const routes: Routes = [
  {
    path: "all-reporting",
    component: AllReportingComponent,
  },
  {
    path: "reporting-statistics",
    component: ReportingStatisticsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportingRoutingModule { }
