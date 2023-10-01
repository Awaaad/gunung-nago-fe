import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EggSaleDetailsComponent } from './egg-sale-details/egg-sale-details.component';

const routes: Routes = [
  {
    path: 'egg-sale-details',
    component: EggSaleDetailsComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EggRoutingModule { }
