import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StateRoutingModule } from './state-routing.module';
import { AddStateComponent } from './add-state/add-state.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [AddStateComponent],
  imports: [
    CommonModule,
    StateRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    NgbModule,
    FormsModule,
  ],
})
export class StateModule {}
