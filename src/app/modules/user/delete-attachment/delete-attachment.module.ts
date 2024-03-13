import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DeleteAttachmentRoutingModule } from './delete-attachment-routing.module';
import { AddDeleteAttachmentComponent } from './add-delete-attachment/add-delete-attachment.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';


@NgModule({
  declarations: [
    AddDeleteAttachmentComponent
  ],
  imports: [
    CommonModule,
    DeleteAttachmentRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule,
    NgbModule,
    NgSelectModule,
  ]
})
export class DeleteAttachmentModule { }
