import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DocumentSettingRoutingModule } from './document-setting-routing.module';
import { AddDocumentSettingComponent } from './add-document-setting/add-document-setting.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [AddDocumentSettingComponent],
  imports: [
    CommonModule,
    DocumentSettingRoutingModule,
    ReactiveFormsModule,
    NgbModule,
    SharedModule,
    FormsModule,
  ],
})
export class DocumentSettingModule {}
