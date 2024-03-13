import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ViewTopicWiseLoComponent } from './view-topic-wise-lo/view-topic-wise-lo.component';
import { AddTopicWiseLoComponent } from './add-topic-wise-lo/add-topic-wise-lo.component';

const routes: Routes = [
  { 
    path : '',
    component: ViewTopicWiseLoComponent
  },
  {
    path: 'add-topic-wise-lo',
    component: AddTopicWiseLoComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TopicWiseLoRoutingModule { }
