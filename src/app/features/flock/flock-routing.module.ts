import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FlockListComponent } from './flock-list/flock-list.component';

const routes: Routes = [
  {
    path: 'flock-list',
    component: FlockListComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FlockRoutingModule { }
