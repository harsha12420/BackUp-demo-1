import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddMeetingPointCategoryComponent } from './add-meeting-point-category/add-meeting-point-category.component';

const routes: Routes = [
  {
    path: '',
    component: AddMeetingPointCategoryComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MeetingPointCategoryRoutingModule {}
