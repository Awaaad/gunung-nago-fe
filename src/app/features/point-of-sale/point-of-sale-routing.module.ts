import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PointOfSaleComponent } from './point-of-sale.component';

const routes: Routes = [
  {
    path: '',
    component: PointOfSaleComponent
  },
  {
    path: 'sales-invoice-id/:salesInvoiceId',
    component: PointOfSaleComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PointOfSaleRoutingModule { }
