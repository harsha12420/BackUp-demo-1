import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrganizationRoutingModule } from './organization-routing.module';
import { AddOrganizationComponent } from './add-organization/add-organization.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { ImageCropperModule } from 'ngx-image-cropper';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    AddOrganizationComponent
  ],
  imports: [
    CommonModule,
    OrganizationRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    NgbModule,
    FormsModule,
    NgxDropzoneModule,
    ImageCropperModule
  ]
})
export class OrganizationModule { }
