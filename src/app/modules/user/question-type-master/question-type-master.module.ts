import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { QuestionTypeMasterRoutingModule } from './question-type-master-routing.module';
import { AddQuestionTypeMasterComponent } from './add-question-type-master/add-question-type-master.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';


@NgModule({
  declarations: [
    AddQuestionTypeMasterComponent
  ],
  imports: [
    CommonModule,
    QuestionTypeMasterRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    NgbModule,
    FormsModule,
    NgSelectModule
  ]
})
export class QuestionTypeMasterModule { }
