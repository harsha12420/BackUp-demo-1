import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EditorRoutingModule } from './editor-routing.module';
import { TestEditorComponent } from './test-editor/test-editor.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    TestEditorComponent
  ],
  imports: [
    CommonModule,
    EditorRoutingModule,
    SharedModule,
  ]
})
export class EditorModule { }
