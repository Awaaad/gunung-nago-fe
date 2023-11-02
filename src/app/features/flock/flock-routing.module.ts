import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FlockListComponent } from './flock-list/flock-list.component';
import { FlockDetailsComponent } from './flock-details/flock-details.component';
import { FlockSaleDetailsComponent } from './flock-sale-details/flock-sale-details.component';
import { FlockStockComponent } from './flock-stock/flock-stock.component';
import { FlockTransferComponent } from './flock-transfer/flock-transfer.component';
import { FlockCageCategoryTransferComponent } from './flock-cage-category-transfer/flock-cage-category-transfer.component';

const routes: Routes = [
  {
    path: 'flock-list',
    component: FlockListComponent
  },
  {
    path: 'flock-sale-details',
    component: FlockSaleDetailsComponent
  },
  {
    path: 'flock-details',
    component: FlockDetailsComponent
  },
  {
    path: 'flock-stock',
    component: FlockStockComponent
  },
  {
    path: 'flock-transfer',
    component: FlockTransferComponent
  },
  {
    path: 'flock-cage-category-transfer',
    component: FlockCageCategoryTransferComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FlockRoutingModule { }
