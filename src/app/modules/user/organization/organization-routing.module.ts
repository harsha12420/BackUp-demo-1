import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddOrganizationComponent } from './add-organization/add-organization.component';

const routes: Routes = [{
  path: '', component: AddOrganizationComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrganizationRoutingModule { }
