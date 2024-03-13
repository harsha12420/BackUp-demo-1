import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddSessionComponent } from './add-session/add-session.component';
import { AddAcademicYearComponent } from './add-academic-year/add-academic-year.component';
import { AcademicYearValidationComponent } from './academic-year-validation/academic-year-validation.component';
import { SourceOfInformationComponent } from './source-of-information/source-of-information.component';

const routes: Routes = [
  {
    path: "session",
    component: AddSessionComponent,
  },
  {
    path: "academic-year",
    component: AddAcademicYearComponent
  },
  {
    path: "academic-year-validation",
    component: AcademicYearValidationComponent
  },
  {
    path: "source-of-information",
    component: SourceOfInformationComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdmissionRoutingModule { }
