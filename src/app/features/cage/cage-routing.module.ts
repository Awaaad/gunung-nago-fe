import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CageListComponent } from './cage-list/cage-list.component';

const routes: Routes = [
  {
    path: 'cage-list',
    component: CageListComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CageRoutingModule { }
