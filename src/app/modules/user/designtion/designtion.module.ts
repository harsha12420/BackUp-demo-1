import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DesigntionRoutingModule } from './designtion-routing.module';
import { AddDesigntionComponent } from './add-designtion/add-designtion.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [AddDesigntionComponent],
  imports: [
    CommonModule,
    DesigntionRoutingModule,
    ReactiveFormsModule,
    NgbModule,
    SharedModule,
    FormsModule,
  ],
})
export class DesigntionModule {}
