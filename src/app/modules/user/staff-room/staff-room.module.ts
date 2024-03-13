import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StaffRoomRoutingModule } from './staff-room-routing.module';
import { AddStaffRoomComponent } from './add-staff-room/add-staff-room.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
  declarations: [AddStaffRoomComponent],
  imports: [
    CommonModule,
    StaffRoomRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    NgbModule,
    FormsModule,
    NgSelectModule,
  ],
})
export class StaffRoomModule {}
