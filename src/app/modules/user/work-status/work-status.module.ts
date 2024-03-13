import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WorkStatusRoutingModule } from './work-status-routing.module';
import { AddWorkStatusComponent } from './add-work-status/add-work-status.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [AddWorkStatusComponent],
  imports: [
    CommonModule,
    WorkStatusRoutingModule,
    ReactiveFormsModule,
    NgbModule,
    SharedModule,
    FormsModule,
  ],
})
export class WorkStatusModule {}
