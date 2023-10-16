import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManureSaleDetailsComponent } from './manure-sale-details/manure-sale-details.component';

const routes: Routes = [
  {
    path: 'manure-sale-details',
    component: ManureSaleDetailsComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManureRoutingModule { }
