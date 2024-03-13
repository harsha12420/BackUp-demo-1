import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddHolidayComponent } from './add-holiday/add-holiday.component';
const routes: Routes = [
  {
    path: '',
    component: AddHolidayComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HolidayRoutingModule { }
