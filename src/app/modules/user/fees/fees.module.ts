import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FeesRoutingModule } from './fees-routing.module';
import { HeadGroupMasterComponent } from './head-group-master/head-group-master.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from 'src/app/shared/shared.module';
import { GroupMasterComponent } from './group-master/group-master.component';
import { FeeHeadAndGroupMappingComponent } from './fee-head-and-group-mapping/fee-head-and-group-mapping.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { StdCategoryWiseMappingComponent } from './std-category-wise-mapping/std-category-wise-mapping.component';
import { CustomDatePipe } from 'src/app/shared/pipes/custom-date.pipe';

@NgModule({
  declarations: [
    HeadGroupMasterComponent,
    GroupMasterComponent,
    FeeHeadAndGroupMappingComponent,
    StdCategoryWiseMappingComponent,
    CustomDatePipe
  ],
  imports: [
    CommonModule,
    FeesRoutingModule,
    ReactiveFormsModule,
    NgbModule,
    SharedModule,
    FormsModule,
    NgSelectModule
  ]
})
export class FeesModule { }
