import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddDeleteAttachmentComponent } from './add-delete-attachment/add-delete-attachment.component';

const routes: Routes = [{
  path: '',
  component: AddDeleteAttachmentComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DeleteAttachmentRoutingModule { }
