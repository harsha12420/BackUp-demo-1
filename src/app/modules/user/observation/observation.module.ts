import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ObservationRoutingModule } from './observation-routing.module';
import { AddObservationComponent } from './add-observation/add-observation.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [AddObservationComponent],
  imports: [
    CommonModule,
    ObservationRoutingModule,
    ReactiveFormsModule,
    NgbModule,
    SharedModule,
    FormsModule,
  ],
})
export class ObservationModule {}
