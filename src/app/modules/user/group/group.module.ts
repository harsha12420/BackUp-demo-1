import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GroupRoutingModule } from './group-routing.module';
import { AddSubGroupComponent } from './add-sub-group/add-sub-group.component';
import { AddRoleComponent } from './add-role/add-role.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';


@NgModule({
  declarations: [AddSubGroupComponent, AddRoleComponent],
  imports: [
    CommonModule,
    GroupRoutingModule,
    NgbModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule,
    NgSelectModule,
  ],
})
export class GroupModule {}
