import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ObservationTypeRoutingModule } from './observation-type-routing.module';
import { AddObservationTypeComponent } from './add-observation-type/add-observation-type.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
  declarations: [AddObservationTypeComponent],
  imports: [
    CommonModule,
    ObservationTypeRoutingModule,
    ReactiveFormsModule,
    NgbModule,
    SharedModule,
    FormsModule,
    NgSelectModule,
  ],
})
export class ObservationTypeModule {}
