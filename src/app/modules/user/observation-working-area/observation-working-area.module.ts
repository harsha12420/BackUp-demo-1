import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ObservationWorkingAreaRoutingModule } from './observation-working-area-routing.module';
import { AddObservationWorkingAreaComponent } from './add-observation-working-area/add-observation-working-area.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
  declarations: [AddObservationWorkingAreaComponent],
  imports: [
    CommonModule,
    ObservationWorkingAreaRoutingModule,
    ReactiveFormsModule,
    NgbModule,
    SharedModule,
    FormsModule,
    NgSelectModule,
  ],
})
export class ObservationWorkingAreaModule {}
