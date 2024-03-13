import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VilageRoutingModule } from './vilage-routing.module';
import { AddVilageComponent } from './add-vilage/add-vilage.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [AddVilageComponent],
  imports: [
    CommonModule,
    VilageRoutingModule,
    ReactiveFormsModule,
    NgbModule,
    SharedModule,
    FormsModule,
    NgSelectModule,
  ],
})
export class VilageModule {}
