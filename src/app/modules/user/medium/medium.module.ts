import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MediumRoutingModule } from './medium-routing.module';
import { AddMediumComponent } from './add-medium/add-medium.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [AddMediumComponent],
  imports: [
    CommonModule,
    MediumRoutingModule,
    ReactiveFormsModule,
    NgbModule,
    SharedModule,
    FormsModule,
  ],
})
export class MediumModule {}
