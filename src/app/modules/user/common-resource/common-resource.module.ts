import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CommonResourceRoutingModule } from './common-resource-routing.module';
import { AddCommonResourceComponent } from './add-common-resource/add-common-resource.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [AddCommonResourceComponent],
  imports: [
    CommonModule,
    CommonResourceRoutingModule,
    ReactiveFormsModule,
    NgbModule,
    SharedModule,
    FormsModule,
  ],
})
export class CommonResourceModule {}
