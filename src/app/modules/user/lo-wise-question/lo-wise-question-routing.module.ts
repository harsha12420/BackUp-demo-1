import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddLoWiseQuestionsComponent } from './add-lo-wise-questions/add-lo-wise-questions.component';
import { ViewLoWiseQuestionsComponent } from './view-lo-wise-questions/view-lo-wise-questions.component';

const routes: Routes = [
  { 
    path : '',
    component: ViewLoWiseQuestionsComponent
  },
  {
    path: 'add-lo-wise-question',
    component: AddLoWiseQuestionsComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoWiseQuestionRoutingModule { }
