import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StateRoutingModule } from './state-routing.module';
import { AddStateComponent } from './add-state/add-state.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
  declarations: [AddStateComponent],
  imports: [
    CommonModule,
    StateRoutingModule,
    ReactiveFormsModule,
    NgbModule,
    SharedModule,
    FormsModule,
    NgSelectModule,
  ],
})
export class StateModule {}
