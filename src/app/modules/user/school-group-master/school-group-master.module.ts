import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SchoolGroupMasterRoutingModule } from './school-group-master-routing.module';
import { AddSchoolGroupMasterComponent } from './add-school-group-master/add-school-group-master.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
  declarations: [AddSchoolGroupMasterComponent],
  imports: [
    CommonModule,
    SchoolGroupMasterRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    NgbModule,
    FormsModule,
    NgSelectModule,
  ],
})
export class SchoolGroupMasterModule {}
