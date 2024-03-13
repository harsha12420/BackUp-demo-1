import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LcApprovalWithFeesRecordComponent } from './lc-approval-with-fees-record/lc-approval-with-fees-record.component';
import { GenerateLcComponent } from './generate-lc/generate-lc.component';
import { DivisionTransfeComponent } from './division-transfer/division-transfe/division-transfe.component';
import { DivisionTransferListComponent } from './division-transfer/division-transfer-list/division-transfer-list.component';
import { FreezeRollNoComponent } from './freeze-roll-no/freeze-roll-no.component';
import { RollNoUpdateComponent } from './roll-no-update/roll-no-update.component';
import { RollNoComponent } from './roll-no/roll-no.component';

const routes: Routes = [
  {
    path: 'lc_approval_with_fees_record',
    component: LcApprovalWithFeesRecordComponent,
  },
  {
    path: 'generate_lc',
    component: GenerateLcComponent,
  },
  {
    path: 'division-transfer',
    component: DivisionTransfeComponent,
  },
  {
    path: 'division-transfer-list',
    component: DivisionTransferListComponent,
  },
  {
    path: "roll_no",
    component: RollNoComponent,
    // resolve: {
    //   data: permissionResolver,
    // },
  },
  {
    path: "roll_no_update",
    component: RollNoUpdateComponent,
    // resolve: {
    //   data: permissionResolver,
    // },
  },
  {
    path: "roll_no_freeze",
    component: FreezeRollNoComponent,
    // resolve: {
    //   data: permissionResolver,
    // },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StudentRoutingModule {}
