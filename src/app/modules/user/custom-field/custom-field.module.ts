import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomFieldRoutingModule } from './custom-field-routing.module';
import { AddFieldComponent } from './add-field/add-field.component';
import { FieldListComponent } from './field-list/field-list.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { SharedModule } from 'src/app/shared/shared.module';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { NgxMatTimepickerModule } from 'ngx-mat-timepicker';
import { FormFieldSelectionComponent } from './form-field-selection/form-field-selection.component';
import { GenerateFormComponent } from './generate-form/generate-form.component';
import { AddViewStepsComponent } from './add-view-steps/add-view-steps.component';
import { AddViewGroupsComponent } from './add-view-groups/add-view-groups.component';
import { MatStepperModule } from '@angular/material/stepper';
import { FormFieldListComponent } from './form-field-list/form-field-list.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { NgxDropzoneModule } from 'ngx-dropzone';

@NgModule({
  declarations: [
    AddFieldComponent,
    FieldListComponent,
    FormFieldSelectionComponent,
    GenerateFormComponent,
    AddViewStepsComponent,
    AddViewGroupsComponent,
    FormFieldListComponent,
  ],
  imports: [
    CommonModule,
    CustomFieldRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    NgbModule,
    FormsModule,
    NgSelectModule,
    BsDatepickerModule.forRoot(),
    NgxMatTimepickerModule,
    MatStepperModule,
    DragDropModule,
    NgxDropzoneModule
  ]
})
export class CustomFieldModule { }
