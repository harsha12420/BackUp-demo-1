import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoWiseSubjectMaterialRoutingModule } from './lo-wise-subject-material-routing.module';
import { AddLoWiseSubjectMaterialComponent } from './add-lo-wise-subject-material/add-lo-wise-subject-material.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { AddProcessLoWiseSubjectMaterialComponent } from './add-process-lo-wise-subject-material/add-process-lo-wise-subject-material.component';

@NgModule({
  declarations: [AddLoWiseSubjectMaterialComponent, AddProcessLoWiseSubjectMaterialComponent],
  imports: [
    CommonModule,
    LoWiseSubjectMaterialRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    NgbModule,
    FormsModule,
    NgSelectModule,
  ],
})
export class LoWiseSubjectMaterialModule {}
