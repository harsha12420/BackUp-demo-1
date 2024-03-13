import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ObservationRelatedToRoutingModule } from './observation-related-to-routing.module';
import { AddObservationRelatedToComponent } from './add-observation-related-to/add-observation-related-to.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
  declarations: [AddObservationRelatedToComponent],
  imports: [
    CommonModule,
    ObservationRelatedToRoutingModule,
    ReactiveFormsModule,
    NgbModule,
    SharedModule,
    FormsModule,
    NgSelectModule,
  ],
})
export class ObservationRelatedToModule {}
