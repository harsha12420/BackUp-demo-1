import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PermissionRoutingModule } from './permission-routing.module';
import { AddPermissionComponent } from './add-permission/add-permission.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
  declarations: [AddPermissionComponent],
  imports: [
    CommonModule,
    PermissionRoutingModule,
    NgbModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule,
    NgSelectModule,
  ],
})
export class PermissionModule {}
