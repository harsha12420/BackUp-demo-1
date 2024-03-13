import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddPermissionComponent } from './add-permission/add-permission.component';

const routes: Routes = [{
  path: 'permission', component: AddPermissionComponent,
},];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PermissionRoutingModule { }
