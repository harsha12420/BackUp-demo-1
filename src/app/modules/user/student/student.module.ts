import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StudentRoutingModule } from './student-routing.module';
import { LcApprovalWithFeesRecordComponent } from './lc-approval-with-fees-record/lc-approval-with-fees-record.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { GenerateLcComponent } from './generate-lc/generate-lc.component';
import { DivisionTransfeComponent } from './division-transfer/division-transfe/division-transfe.component';
import { DivisionTransferListComponent } from './division-transfer/division-transfer-list/division-transfer-list.component';
import { FreezeRollNoComponent } from './freeze-roll-no/freeze-roll-no.component';
import { RollNoUpdateComponent } from './roll-no-update/roll-no-update.component';
import { RollNoComponent } from './roll-no/roll-no.component';

@NgModule({
  declarations: [
    LcApprovalWithFeesRecordComponent,
    GenerateLcComponent,
    DivisionTransfeComponent,
    DivisionTransferListComponent,
    FreezeRollNoComponent,
    RollNoUpdateComponent,
    RollNoComponent
  ],
  imports: [
    CommonModule,
    StudentRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    NgbModule,
    FormsModule,
    NgSelectModule,
    NgxDropzoneModule,
  ],
})
export class StudentModule {}
