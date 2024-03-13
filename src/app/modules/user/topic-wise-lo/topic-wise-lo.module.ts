import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TopicWiseLoRoutingModule } from './topic-wise-lo-routing.module';
import { AddTopicWiseLoComponent } from './add-topic-wise-lo/add-topic-wise-lo.component';
import { ViewTopicWiseLoComponent } from './view-topic-wise-lo/view-topic-wise-lo.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';


@NgModule({
  declarations: [
    AddTopicWiseLoComponent,
    ViewTopicWiseLoComponent
  ],
  imports: [
    CommonModule,
    TopicWiseLoRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    NgbModule,
    FormsModule,
    NgSelectModule
  ]
})
export class TopicWiseLoModule { }
