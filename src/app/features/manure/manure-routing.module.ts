import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManureSaleDetailsComponent } from './manure-sale-details/manure-sale-details.component';
import { ManureStockComponent } from './manure-stock/manure-stock.component';

const routes: Routes = [
  {
    path: 'manure-sale-details',
    component: ManureSaleDetailsComponent
  },
  {
    path: 'manure-stock',
    component: ManureStockComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManureRoutingModule { }
