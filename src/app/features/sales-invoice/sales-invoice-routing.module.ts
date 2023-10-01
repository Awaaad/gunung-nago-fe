import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SalesInvoiceListComponent } from './sales-invoice-list/sales-invoice-list.component';
import { SalesInvoiceDetailsComponent } from './sales-invoice-details/sales-invoice-details.component';

const routes: Routes = [
  {
    path: 'sales-invoice-list',
    component: SalesInvoiceListComponent
  },
  {
    path: 'sales-invoice-details',
    component: SalesInvoiceDetailsComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SalesInvoiceRoutingModule { }
