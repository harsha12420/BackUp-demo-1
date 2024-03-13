import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddLoWiseSubjectMaterialComponent } from './add-lo-wise-subject-material/add-lo-wise-subject-material.component';
import { AddProcessLoWiseSubjectMaterialComponent } from './add-process-lo-wise-subject-material/add-process-lo-wise-subject-material.component';

const routes: Routes = [
  {
    path: '',
    component: AddLoWiseSubjectMaterialComponent,
  },
  {
    path: 'add-process-subject-material',
    component: AddProcessLoWiseSubjectMaterialComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LoWiseSubjectMaterialRoutingModule {}
