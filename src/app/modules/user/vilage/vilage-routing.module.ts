import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddVilageComponent } from './add-vilage/add-vilage.component';

const routes: Routes = [
  {
    path: '',
    component: AddVilageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VilageRoutingModule {}
