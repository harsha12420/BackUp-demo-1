import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HeadGroupMasterComponent } from './head-group-master/head-group-master.component';
import { GroupMasterComponent } from './group-master/group-master.component';
import { FeeHeadAndGroupMappingComponent } from './fee-head-and-group-mapping/fee-head-and-group-mapping.component';
import { StdCategoryWiseMappingComponent } from './std-category-wise-mapping/std-category-wise-mapping.component';

const routes: Routes = [
  {
    path: 'fee-group-master',
    component: GroupMasterComponent
  },
  {
    path: 'fee-head-group-master',
    component: HeadGroupMasterComponent,
  },
  {
    path: 'fee-head-and-group-mapping',
    component: FeeHeadAndGroupMappingComponent
  },
  {
    path: 'std-category-wise-mapping',
    component: StdCategoryWiseMappingComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FeesRoutingModule { }
