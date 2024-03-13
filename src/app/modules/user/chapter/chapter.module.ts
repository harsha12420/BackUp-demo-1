import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChapterRoutingModule } from './chapter-routing.module';
import { AddChapterComponent } from './add-chapter/add-chapter.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [AddChapterComponent],
  imports: [
    CommonModule,
    ChapterRoutingModule,
    ReactiveFormsModule,
    NgbModule,
    SharedModule,
    FormsModule,
  ],
})
export class ChapterModule {}
