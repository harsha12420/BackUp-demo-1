import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddChapterComponent } from './add-chapter/add-chapter.component';

const routes: Routes = [
  {
    path: '',
    component: AddChapterComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChapterRoutingModule { }
