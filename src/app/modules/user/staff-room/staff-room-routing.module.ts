import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddStaffRoomComponent } from './add-staff-room/add-staff-room.component';

const routes: Routes = [
  {
    path: '',
    component: AddStaffRoomComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StaffRoomRoutingModule { }
