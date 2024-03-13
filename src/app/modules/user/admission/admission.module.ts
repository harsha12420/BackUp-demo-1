import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdmissionRoutingModule } from './admission-routing.module';
import { AddSessionComponent } from './add-session/add-session.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AddAcademicYearComponent } from './add-academic-year/add-academic-year.component';
import { AcademicYearValidationComponent } from './academic-year-validation/academic-year-validation.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { SourceOfInformationComponent } from './source-of-information/source-of-information.component';


@NgModule({
  declarations: [
    AddSessionComponent,
    AddAcademicYearComponent,
    AcademicYearValidationComponent,
    SourceOfInformationComponent
  ],
  imports: [
    CommonModule,
    AdmissionRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule,
    NgbModule,
    NgSelectModule,
  ]
})
export class AdmissionModule { }
