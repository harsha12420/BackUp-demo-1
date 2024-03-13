import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PincodeRoutingModule } from './pincode-routing.module';
import { AddPincodeComponent } from './add-pincode/add-pincode.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [AddPincodeComponent],
  imports: [
    CommonModule,
    PincodeRoutingModule,
    ReactiveFormsModule,
    NgbModule,
    SharedModule,
    FormsModule,
    NgSelectModule,
  ],
})
export class PincodeModule {}
