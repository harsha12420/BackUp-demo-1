import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MeetingPointCategoryRoutingModule } from './meeting-point-category-routing.module';
import { AddMeetingPointCategoryComponent } from './add-meeting-point-category/add-meeting-point-category.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [AddMeetingPointCategoryComponent],
  imports: [
    CommonModule,
    MeetingPointCategoryRoutingModule,
    ReactiveFormsModule,
    NgbModule,
    SharedModule,
    FormsModule,
  ],
})
export class MeetingPointCategoryModule {}
