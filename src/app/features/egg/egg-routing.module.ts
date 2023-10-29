import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EggSaleDetailsComponent } from './egg-sale-details/egg-sale-details.component';
import { EggTransferComponent } from './egg-transfer/egg-transfer.component';

const routes: Routes = [
  {
    path: 'egg-sale-details',
    component: EggSaleDetailsComponent
  },
  {
    path: 'egg-transfer',
    component: EggTransferComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EggRoutingModule { }
