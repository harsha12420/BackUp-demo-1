import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddDocumentSettingComponent } from './add-document-setting/add-document-setting.component';

const routes: Routes = [
  {
    path: '',
    component: AddDocumentSettingComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DocumentSettingRoutingModule { }
