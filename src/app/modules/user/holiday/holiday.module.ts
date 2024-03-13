import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HolidayRoutingModule } from './holiday-routing.module';
import { AddHolidayComponent } from './add-holiday/add-holiday.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [AddHolidayComponent],
  imports: [
    CommonModule,
    HolidayRoutingModule,
    ReactiveFormsModule,
    NgbModule,
    SharedModule,
    FormsModule
  ],
})
export class HolidayModule {}
