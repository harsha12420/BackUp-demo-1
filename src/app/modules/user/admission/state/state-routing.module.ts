import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddStateComponent } from './add-state/add-state.component';

const routes: Routes = [
  {
    path: '',
    component: AddStateComponent,
    
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StateRoutingModule {}
