import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { JobRoundRoutingModule } from './job-round-routing.module';
import { AddJobRoundComponent } from './add-job-round/add-job-round.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [AddJobRoundComponent],
  imports: [
    CommonModule,
    JobRoundRoutingModule,
    ReactiveFormsModule,
    NgbModule,
    SharedModule,
    FormsModule,
  ],
})
export class JobRoundModule {}
