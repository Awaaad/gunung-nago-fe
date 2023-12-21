import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HealthListComponent } from './health-list/health-list.component';
import { HealthDetailsComponent } from './health-details/health-details.component';
import { HealthStockComponent } from './health-stock/health-stock.component';
import { HealthStockDetailsComponent } from './health-stock-details/health-stock-details.component';

const routes: Routes = [
  {
    path: 'health-list',
    component: HealthListComponent
  },
  {
    path: 'health-details',
    component: HealthDetailsComponent
  },
  {
    path: 'health-stock',
    component: HealthStockComponent
  },
  {
    path: 'health-stock-details/:id',
    component: HealthStockDetailsComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HealthRoutingModule { }
