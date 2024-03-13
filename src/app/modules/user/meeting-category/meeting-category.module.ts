import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MeetingCategoryRoutingModule } from './meeting-category-routing.module';
import { AddMeetingCategoryComponent } from './add-meeting-category/add-meeting-category.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [AddMeetingCategoryComponent],
  imports: [
    CommonModule,
    MeetingCategoryRoutingModule,
    ReactiveFormsModule,
    NgbModule,
    SharedModule,
    FormsModule,
  ],
})
export class MeetingCategoryModule {}
