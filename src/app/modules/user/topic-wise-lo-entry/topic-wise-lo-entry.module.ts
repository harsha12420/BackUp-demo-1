import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TopicWiseLoEntryRoutingModule } from './topic-wise-lo-entry-routing.module';
import { LoLevelMasterComponent } from './lo-level-master/lo-level-master.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from 'src/app/shared/shared.module';
import { DragDropModule } from '@angular/cdk/drag-drop';

@NgModule({
  declarations: [
    LoLevelMasterComponent
  ],
  imports: [
    CommonModule,
    TopicWiseLoEntryRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    NgbModule,
    FormsModule,
    NgSelectModule,
    DragDropModule
  ]
})
export class TopicWiseLoEntryModule { }
