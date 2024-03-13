import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddFieldComponent } from './add-field/add-field.component';
import { FieldListComponent } from './field-list/field-list.component';
import { FormFieldSelectionComponent } from './form-field-selection/form-field-selection.component';
import { GenerateFormComponent } from './generate-form/generate-form.component';
import { AddViewStepsComponent } from './add-view-steps/add-view-steps.component';
import { AddViewGroupsComponent } from './add-view-groups/add-view-groups.component';
import { FormFieldListComponent } from './form-field-list/form-field-list.component';

const routes: Routes = [
  {
    path: 'add',
    component: AddFieldComponent
  },
  {
    path: 'list',
    component: FieldListComponent
  },
  {
    path: 'select',
    component: FormFieldSelectionComponent
  },
  {
    path: 'generate-form',
    component: GenerateFormComponent
  },
  {
    path: 'steps',
    component: AddViewStepsComponent
  },
  {
    path: 'groups',
    component: AddViewGroupsComponent
  },
  {
    path: 'form-fields',
    component: FormFieldListComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomFieldRoutingModule { }
