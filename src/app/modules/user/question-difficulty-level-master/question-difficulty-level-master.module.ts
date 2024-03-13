import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { QuestionDifficultyLevelMasterRoutingModule } from './question-difficulty-level-master-routing.module';
import { AddQuestionDifficultyLevelMasterComponent } from './add-question-difficulty-level-master/add-question-difficulty-level-master.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';


@NgModule({
  declarations: [
    AddQuestionDifficultyLevelMasterComponent
  ],
  imports: [
    CommonModule,
    QuestionDifficultyLevelMasterRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    NgbModule,
    FormsModule,
    NgSelectModule
  ]
})
export class QuestionDifficultyLevelMasterModule { }
