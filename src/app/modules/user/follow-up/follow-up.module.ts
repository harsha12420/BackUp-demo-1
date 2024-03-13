import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FollowUpRoutingModule } from './follow-up-routing.module';
import { AddFollowUpComponent } from './add-follow-up/add-follow-up.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [AddFollowUpComponent],
  imports: [
    CommonModule,
    FollowUpRoutingModule,
    ReactiveFormsModule,
    NgbModule,
    SharedModule,
    FormsModule
  ],
})
export class FollowUpModule {}
