import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EggSaleDetailsComponent } from './egg-sale-details/egg-sale-details.component';
import { EggTransferComponent } from './egg-transfer/egg-transfer.component';
import { EggStockComponent } from './egg-stock/egg-stock.component';
import { EggReportComponent } from './egg-report/egg-report.component';

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
    path: 'egg-report',
    component: EggReportComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EggRoutingModule { }
