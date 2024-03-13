import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StudentExitRoutingModule } from './student-exit-routing.module';
import { LeaveMasterComponent } from './leave-master/leave-master.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    LeaveMasterComponent
  ],
  imports: [
    CommonModule,
    StudentExitRoutingModule,
    ReactiveFormsModule,
    NgbModule,
    SharedModule,
    FormsModule,
  ]
})
export class StudentExitModule { }
