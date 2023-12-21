import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EggSaleDetailsComponent } from './egg-sale-details/egg-sale-details.component';
import { EggTransferComponent } from './egg-transfer/egg-transfer.component';
import { EggStockComponent } from './egg-stock/egg-stock.component';
import { EggReportComponent } from './egg-report/egg-report.component';
import { EggCategoryDetailsComponent } from './egg-category-details/egg-category-details.component';
import { EggCategoryListComponent } from './egg-category-list/egg-category-list.component';
import { EggStockDetailsComponent } from './egg-stock-details/egg-stock-details.component';

const routes: Routes = [
  {
    path: 'egg-sale-details',
    component: EggSaleDetailsComponent
  },
  {
    path: 'egg-transfer',
    component: EggTransferComponent
  },
  {
    path: 'egg-stock',
    component: EggStockComponent
  },
  {
    path: 'egg-stock-details/:id',
    component: EggStockDetailsComponent
  },
  {
    path: 'egg-report',
    component: EggReportComponent
  },
  {
    path: 'egg-report/:id',
    component: EggReportComponent
  },
  {
    path: 'egg-category-list',
    component: EggCategoryListComponent
  },
  {
    path: 'egg-category-details',
    component: EggCategoryDetailsComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EggRoutingModule { }
