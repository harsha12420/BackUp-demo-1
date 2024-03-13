import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PointRoutingModule } from './point-routing.module';
import { AddPointComponent } from './add-point/add-point.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
  declarations: [AddPointComponent],
  imports: [
    CommonModule,
    PointRoutingModule,
    ReactiveFormsModule,
    NgbModule,
    SharedModule,
    FormsModule,
    NgSelectModule,
  ],
})
export class PointModule {}
