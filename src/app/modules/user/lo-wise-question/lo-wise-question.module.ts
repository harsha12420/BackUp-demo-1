import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoWiseQuestionRoutingModule } from './lo-wise-question-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { ViewLoWiseQuestionsComponent } from './view-lo-wise-questions/view-lo-wise-questions.component';
import { AddLoWiseQuestionsComponent } from './add-lo-wise-questions/add-lo-wise-questions.component';
import { BsModalRef, ModalModule } from 'ngx-bootstrap/modal';

@NgModule({
  declarations: [
    ViewLoWiseQuestionsComponent,
    AddLoWiseQuestionsComponent
  ],
  imports: [
    CommonModule,
    LoWiseQuestionRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    NgbModule,
    FormsModule,
    NgSelectModule,
    ModalModule.forRoot(),
  ],
  providers: [
    BsModalRef
  ]
})
export class LoWiseQuestionModule { }
