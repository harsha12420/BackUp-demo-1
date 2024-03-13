import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddQuestionTypeMasterComponent } from './add-question-type-master/add-question-type-master.component';

const routes: Routes = [
  {
    path: '',
    component: AddQuestionTypeMasterComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QuestionTypeMasterRoutingModule { }
