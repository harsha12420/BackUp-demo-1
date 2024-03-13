import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { UserComponent } from './user.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { StandardDocumentComponent } from './standard-document/standard-document.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
  declarations: [UserComponent, DashboardComponent, StandardDocumentComponent],
  imports: [CommonModule, UserRoutingModule, SharedModule, FormsModule, ReactiveFormsModule, NgbModule, NgSelectModule],
})
export class UserModule { }
