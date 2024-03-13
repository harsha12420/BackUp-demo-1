import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SubDistrictRoutingModule } from './sub-district-routing.module';
import { AddSubDistrictComponent } from './add-sub-district/add-sub-district.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [AddSubDistrictComponent],
  imports: [
    CommonModule,
    SubDistrictRoutingModule,
    ReactiveFormsModule,
    NgbModule,
    SharedModule,
    FormsModule,
    NgSelectModule,
  ],
})
export class SubDistrictModule {}
