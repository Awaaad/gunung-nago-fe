import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManureSaleDetailsComponent } from './manure-sale-details/manure-sale-details.component';
import { ManureStockComponent } from './manure-stock/manure-stock.component';
import { ManureListComponent } from './manure-list/manure-list.component';
import { ManureDetailsComponent } from './manure-details/manure-details.component';

const routes: Routes = [
  {
    path: 'manure-sale-details',
    component: ManureSaleDetailsComponent
  },
  {
    path: 'manure-stock',
    component: ManureStockComponent
  },
  {
    path: 'manure-list',
    component: ManureListComponent
  },
  {
    path: 'manure-details',
    component: ManureDetailsComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManureRoutingModule { }
