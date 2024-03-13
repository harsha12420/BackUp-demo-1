import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoLevelMasterComponent } from './lo-level-master/lo-level-master.component';

const routes: Routes = [
  {
    path: '',
    component: LoLevelMasterComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TopicWiseLoEntryRoutingModule { }
