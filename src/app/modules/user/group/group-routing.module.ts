import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddSubGroupComponent } from './add-sub-group/add-sub-group.component';
import { AddRoleComponent } from './add-role/add-role.component';

const routes: Routes = [
  {
    path: 'sub-group', component: AddSubGroupComponent,
  },
  {
    path: 'role', component: AddRoleComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GroupRoutingModule { }
