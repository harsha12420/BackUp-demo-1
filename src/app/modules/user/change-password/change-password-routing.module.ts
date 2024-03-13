import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EditChangePasswordComponent } from './edit-change-password/edit-change-password.component';

const routes: Routes = [
  {
    path: '',
    component: EditChangePasswordComponent,
  },
];

@NgModule({

  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChangePasswordRoutingModule {}
