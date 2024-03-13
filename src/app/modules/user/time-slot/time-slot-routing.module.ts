import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddTimeSoltComponent } from './add-time-solt/add-time-solt.component';

const routes: Routes = [
  {
    path: '',
    component: AddTimeSoltComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TimeSlotRoutingModule {}
