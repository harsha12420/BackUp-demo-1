import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddMeetingCategoryComponent } from './add-meeting-category/add-meeting-category.component';

const routes: Routes = [
  {
    path: '',
    component: AddMeetingCategoryComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MeetingCategoryRoutingModule { }
