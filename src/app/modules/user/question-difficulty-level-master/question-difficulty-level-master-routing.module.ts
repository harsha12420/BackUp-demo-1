import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddQuestionDifficultyLevelMasterComponent } from './add-question-difficulty-level-master/add-question-difficulty-level-master.component';

const routes: Routes = [
  {
    path: '',
    component: AddQuestionDifficultyLevelMasterComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QuestionDifficultyLevelMasterRoutingModule { }
