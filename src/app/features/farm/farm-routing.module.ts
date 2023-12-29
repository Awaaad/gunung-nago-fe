import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FarmListComponent } from './farm-list/farm-list.component';
import { FarmDetailsComponent } from './farm-details/farm-details.component';

const routes: Routes = [
  {
    path: 'farm-list',
    component: FarmListComponent
  },
  {
    path: 'farm-details',
    component: FarmDetailsComponent
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FarmRoutingModule { }
