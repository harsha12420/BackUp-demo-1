import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FeeCategoryRoutingModule } from './fee-category-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FeeCategoryComponent } from './fee-category.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    FeeCategoryComponent
  ],
  imports: [
    CommonModule,
    FeeCategoryRoutingModule,
    ReactiveFormsModule,
    NgbModule,
    FormsModule,
    SharedModule
  ]
})
export class FeeCategoryModule { }
