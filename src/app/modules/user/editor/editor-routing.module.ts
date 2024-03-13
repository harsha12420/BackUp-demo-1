import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TestEditorComponent } from './test-editor/test-editor.component';

const routes: Routes = [
  {
    path: '',
    component: TestEditorComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EditorRoutingModule { }
